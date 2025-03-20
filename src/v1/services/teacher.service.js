import prisma from "../../config/prisma.js";
import { ErrorNotFound } from "../../utils/AppError.js";
import { ErrorMessages } from "../../langs/en.js";
import { getMailsInMention } from "../../utils/regex.js";

export const registerStudents = async ({ students, teacher }) => {
    const teacherInfo = await prisma.teacher.findUnique({
        where: { email: teacher },
    });
    if (!teacherInfo) {
        throw new ErrorNotFound(ErrorMessages.TEACHER_NOT_FOUND);
    }

    const users = await prisma.student.findMany({
        where: { email: { in: students } },
    });
    const registration = users.map((element) => {
        return {
            studentId: element.id,
            teacherId: teacherInfo.id,
        };
    });
    return await prisma.registration.createMany({
        data: registration,
    });
};

export const getStudentByTeachers = async (teacher) => {
    const teachers = await prisma.teacher.findMany({
        where: { email: { in: teacher } },
    });
    if (teachers.length < teacher.length) {
        throw new ErrorNotFound(ErrorMessages.ONE_OR_MORE_TEACHER_NOT_FOUND);
    }
    const teacherIds = teachers.map((teacher) => teacher.id);

    const students = await prisma.registration.findMany({
        where: { teacherId: { in: teacherIds } },
        include: { student: true },
    });
    const studentRegistrations = students.reduce((acc, registration) => {
        const studentId = registration.studentId;
        if (!acc[studentId]) {
            acc[studentId] = new Set();
        }
        acc[studentId].add(registration.teacherId);
        return acc;
    }, {});

    const commonStudentIds = Object.keys(studentRegistrations)
        .filter((studentId) => {
            return studentRegistrations[studentId].size === teacherIds.length;
        })
        .map(Number);

    const commonStudents = await prisma.student.findMany({
        where: { id: { in: commonStudentIds } },
        select: { email: true },
    });

    return { students: commonStudents.map((student) => student.email) };
};

export const suspendStudent = async (student) => {
    const studentInfo = await prisma.student.findUnique({
        where: { email: student },
    });
    if (!studentInfo) {
        throw new ErrorNotFound(ErrorMessages.STUDENT_NOT_FOUND);
    }
    await prisma.student.update({
        where: { id: studentInfo.id },
        data: { isSuspended: !studentInfo.isSuspended },
    });
};

export const getRecipientNotifications = async ({ teacher, notification }) => {
    const teacherInfo = await prisma.teacher.findUnique({
        where: { email: teacher },
    });
    if (!teacherInfo) {
        throw new ErrorNotFound(ErrorMessages.TEACHER_NOT_FOUND);
    }
    const mails = getMailsInMention(notification);
    const students = await prisma.student.findMany({
        where: { email: { in: mails }, isSuspended: false },
    });
    if (students.length < mails.length) {
        throw new ErrorNotFound(ErrorMessages.ONE_OR_MORE_STUDENT_NOT_FOUND);
    }
    const studentRegisted = await prisma.registration.findMany({
        where: { teacherId: teacherInfo.id },
        select: { student: { select: { email: true } } },
    });
    const studentEmails = studentRegisted.map(
        (student) => student.student.email
    );
    const emails = [...new Set([...mails, ...studentEmails])];
    await prisma.notification.create({
        data: {
            teacherId: teacherInfo.id,
            notificationText: notification,
            mentions: {
                create: students.map((student) => {
                    return {
                        studentId: student.id,
                    };
                }),
            },
        },
    });
    return emails;
};

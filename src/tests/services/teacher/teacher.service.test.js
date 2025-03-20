import prisma from "../../../config/prisma.js";
import {
    registerStudents,
    getStudentByTeachers,
    suspendStudent,
    getRecipientNotifications,
} from "../../../v1/services/teacher.service.js";
import { ErrorNotFound } from "../../../utils/AppError.js";
import { jest } from "@jest/globals";

jest.mock("../../../config/prisma");

describe("Teacher Service", () => {
    describe("registerStudents()", () => {
        it("should register students successfully", async () => {
            prisma.teacher.findUnique = jest
                .fn()
                .mockResolvedValue({ id: "teacher1" });
            prisma.student.findMany = jest.fn().mockResolvedValue([
                { id: "student1", email: "student1@example.com" },
                { id: "student2", email: "student2@example.com" },
            ]);
            prisma.registration.createMany = jest
                .fn()
                .mockResolvedValue({ count: 2 });

            const result = await registerStudents({
                students: ["student1@example.com", "student2@example.com"],
                teacher: "teacher1@example.com",
            });

            expect(result).toStrictEqual({ count: 2 });
            expect(prisma.teacher.findUnique).toHaveBeenCalledWith({
                where: { email: "teacher1@example.com" },
            });
            expect(prisma.student.findMany).toHaveBeenCalledWith({
                where: {
                    email: {
                        in: ["student1@example.com", "student2@example.com"],
                    },
                },
            });
            expect(prisma.registration.createMany).toHaveBeenCalledWith({
                data: [
                    { studentId: "student1", teacherId: "teacher1" },
                    { studentId: "student2", teacherId: "teacher1" },
                ],
            });
        });

        it("should throw ErrorNotFound when teacher email does not exist", async () => {
            prisma.teacher.findUnique = jest.fn().mockResolvedValue(null);

            await expect(
                registerStudents({
                    students: ["student1@example.com", "student2@example.com"],
                    teacher: "nonexistent_teacher@example.com",
                })
            ).rejects.toThrow(ErrorNotFound);
            await expect(
                registerStudents({
                    students: ["student1@example.com", "student2@example.com"],
                    teacher: "nonexistent_teacher@example.com",
                })
            ).rejects.toThrow(ErrorNotFound);
        });
    });

    describe("getStudentByTeachers()", () => {
        it("Should return students common to all teachers", async () => {
            prisma.teacher.findMany = jest
                .fn()
                .mockResolvedValue([{ id: "teacher1" }, { id: "teacher2" }]);
            prisma.registration.findMany = jest.fn().mockResolvedValue([
                { studentId: "student1", teacherId: "teacher1" },
                { studentId: "student1", teacherId: "teacher2" },
                { studentId: "student2", teacherId: "teacher1" },
                { studentId: "student2", teacherId: "teacher2" },
            ]);
            prisma.student.findMany = jest
                .fn()
                .mockResolvedValue([
                    { email: "student1@example.com" },
                    { email: "student2@example.com" },
                ]);

            const result = await getStudentByTeachers(["teacher1", "teacher2"]);

            expect(result).toEqual({
                students: ["student1@example.com", "student2@example.com"],
            });
        });

        it("Should throw ErrorNotFound when one or more teachers are not found", async () => {
            prisma.teacher.findMany = jest
                .fn()
                .mockResolvedValue([{ id: "teacher1" }]);

            await expect(
                getStudentByTeachers(["teacher1", "teacher2"])
            ).rejects.toThrow(ErrorNotFound);
            await expect(
                getStudentByTeachers(["teacher1", "teacher2"])
            ).rejects.toThrow(ErrorNotFound);
        });
    });

    describe("suspendStudent()", () => {
        it("Should suspend a student", async () => {
            prisma.student.findUnique = jest
                .fn()
                .mockResolvedValue({ id: "student1", isSuspended: false });
            prisma.student.update = jest
                .fn()
                .mockResolvedValue({ id: "student1", isSuspended: true });

            await suspendStudent("student1");

            expect(prisma.student.update).toHaveBeenCalledWith({
                where: { id: "student1" },
                data: { isSuspended: true },
            });
        });

        it("Should throw ErrorNotFound when student is not found", async () => {
            prisma.student.findUnique = jest.fn().mockResolvedValue(null);

            await expect(suspendStudent("nonexistent_student")).rejects.toThrow(
                ErrorNotFound
            );
            await expect(suspendStudent("nonexistent_student")).rejects.toThrow(
                ErrorNotFound
            );
        });
    });

    describe("getRecipientNotifications()", () => {
        it("Should create notification and return emails", async () => {
            prisma.teacher.findUnique = jest
                .fn()
                .mockResolvedValue({ id: "teacher1" });

            prisma.student.findMany = jest
                .fn()
                .mockResolvedValue([
                    { id: "student1", email: "student1@example.com" },
                ]);

            prisma.registration.findMany = jest
                .fn()
                .mockResolvedValue([
                    { student: { email: "student1@example.com" } },
                ]);

            prisma.notification.create = jest.fn().mockResolvedValue(true);

            const result = await getRecipientNotifications({
                teacher: "teacher1",
                notification:
                    "Test Notification mentioning @student1@example.com",
            });

            expect(result).toEqual(["student1@example.com"]);
        });

        it("Should throw ErrorNotFound when teacher is not found", async () => {
            prisma.teacher.findUnique = jest.fn().mockResolvedValue(null);
            await expect(
                getRecipientNotifications({
                    teacher: "nonexistent_teacher",
                    notification: "Test Notification",
                })
            ).rejects.toThrow(ErrorNotFound);
            await expect(
                getRecipientNotifications({
                    teacher: "nonexistent_teacher",
                    notification: "Test Notification",
                })
            ).rejects.toThrow(ErrorNotFound);
        });
    });
});

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const teacherEmail = "teacherken@gmail.com";
    const teacher = await prisma.teacher.create({
        data: {
            email: teacherEmail,
        },
    });

    const studentEmail = "studentjon@gmail.com";
    const student = await prisma.student.create({
        data: {
            email: studentEmail,
            isSuspended: false,
        },
    });

    await prisma.registration.create({
        data: {
            teacherId: teacher.id,
            studentId: student.id,
        },
    });

    console.log("✅ Teacher and student registered successfully!");

    const notificationText = "Hello students! @studentjon@gmail.com";
    await prisma.notification.create({
        data: {
            teacherId: teacher.id,
            notificationText: notificationText,
            mentions: {
                create: [
                    {
                        studentId: student.id,
                    },
                ],
            },
        },
    });

    console.log("✅ Notification created and student mentioned!");

    // Log to confirm
    console.log(`Teacher: ${teacher.email}, Student: ${student.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

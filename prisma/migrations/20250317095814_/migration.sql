-- CreateTable
CREATE TABLE `Teacher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Teacher_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `isSuspended` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Student_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Registration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacherId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,

    UNIQUE INDEX `Registration_teacherId_studentId_key`(`teacherId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacherId` INTEGER NOT NULL,
    `notificationText` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationMention` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `notificationId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,

    UNIQUE INDEX `NotificationMention_notificationId_studentId_key`(`notificationId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_Registration` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_Registration_AB_unique`(`A`, `B`),
    INDEX `_Registration_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Registration` ADD CONSTRAINT `Registration_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registration` ADD CONSTRAINT `Registration_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationMention` ADD CONSTRAINT `NotificationMention_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `Notification`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationMention` ADD CONSTRAINT `NotificationMention_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Registration` ADD CONSTRAINT `_Registration_A_fkey` FOREIGN KEY (`A`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Registration` ADD CONSTRAINT `_Registration_B_fkey` FOREIGN KEY (`B`) REFERENCES `Teacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

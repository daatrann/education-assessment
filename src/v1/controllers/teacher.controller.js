import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { AppResponse } from "../../utils/AppResponse.js";
import { catchAsync } from "../../utils/catchAsync.js";
import {
    registerStudents,
    getStudentByTeachers,
    suspendStudent,
    getRecipientNotifications,
} from "../services/teacher.service.js";

export const onRegisterStudents = catchAsync(async (req, res) => {
    const { students, teacher } = req.body;
    await registerStudents({ students, teacher });
    new AppResponse(res, StatusCodes.NO_CONTENT, ReasonPhrases.OK);
});

export const onGetStudentByTeachers = catchAsync(async (req, res) => {
    const { teacher } = req.query;
    const data = await getStudentByTeachers(teacher);
    new AppResponse(res, StatusCodes.OK, ReasonPhrases.OK, data);
});

export const onSuspendStudent = catchAsync(async (req, res) => {
    const { student } = req.body;
    await suspendStudent(student);
    new AppResponse(res, StatusCodes.NO_CONTENT, ReasonPhrases.OK);
});

export const onGetRecipientNotifications = catchAsync(async (req, res) => {
    const { teacher, notification } = req.body;
    const recipient = await getRecipientNotifications({
        teacher,
        notification,
    });
    new AppResponse(res, StatusCodes.OK, ReasonPhrases.OK, recipient);
});

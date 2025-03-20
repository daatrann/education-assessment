import { Router } from "express";
import {
    onRegisterStudents,
    onGetStudentByTeachers,
    onSuspendStudent,
    onGetRecipientNotifications,
} from "../controllers/teacher.controller.js";

const teacherRoutes = Router();

teacherRoutes.post("/register", onRegisterStudents);
teacherRoutes.get("/commonstudents", onGetStudentByTeachers);
teacherRoutes.post("/suspend", onSuspendStudent);
teacherRoutes.post("/retrievefornotifications", onGetRecipientNotifications);

export default teacherRoutes;

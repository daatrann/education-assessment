import { Router } from "express";
import teacherRoutes from "./teacher.routes.js";

const v1Router = Router();

v1Router.get("/", (req, res) => {
    res.json({ message: "API v1" });
});

v1Router.use(teacherRoutes);

export default v1Router;

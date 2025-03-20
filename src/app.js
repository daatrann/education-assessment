import e from "express";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import routes from "./v1/routes/v1Router.js";
const app = e();

app.use(e.json());
app.use(cors());
app.use("/api", routes);
app.use(globalErrorHandler);
app.get("/healthy", (req, res) => {
    res.json({ message: "OK" });
});

export default app;

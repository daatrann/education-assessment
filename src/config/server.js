import { createServer } from "http";
import app from "../app.js";

export const httpServer = createServer(app);

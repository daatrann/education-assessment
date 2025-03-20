import env from "./src/config/env.js";
import logger from "./src/config/logger.js";
import prisma from "./src/config/prisma.js";
import { httpServer } from "./src/config/server.js";
(async function () {
    try {
        await prisma.$connect();
        logger.info("Connected to database");
        httpServer.listen(env.PORT, function () {
            logger.info(
                `Server is running on port: ${env.PORT} in ${env.NODE_ENV} environment`
            );
        });
    } catch (error) {
        logger.error("Error connecting to database:", error);
        process.exit(1);
    }
})();

process.on("uncaughtException", function (err) {
    logger.error("Uncaught exception, shutting down gracefully...", err);
    process.exit(1);
});

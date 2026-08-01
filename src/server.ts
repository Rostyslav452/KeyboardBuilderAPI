import { env } from "./config/env.js";
import app from "./app.js";
import sequelize from "./config/db.connection.js";
import logger from "./config/logger.js";
import type { Server } from "node:http";

const serverLogger = logger.child({ module: "SERVER" });
const PORT = env.PORT || 3000;
let server: Server | null = null;
let isShuttingDown = false;

const shutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    serverLogger.info("Shutdown signal received");

    try {
        await new Promise<void>((resolve, reject) => {
            if (!server) {
                resolve();
                return;
            }
            server.close((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        await sequelize.close();
        serverLogger.info("DB shut down successfully");
        process.exit(0);
    } catch (error) {
        serverLogger.error({ signal, error }, "Shutdown failed");
        process.exit(1);
    }
};

const start = async () => {
    try {
        await sequelize.authenticate();
        serverLogger.info("Connection to DB successful");

        server = app.listen(PORT, () => {
            serverLogger.info({
                msg: `Server started successful on PORT ${PORT}`,
                port: PORT,
            });
        });
    } catch (error) {
        serverLogger.fatal(error, "Failed to connect:");
        process.exit(1);
    }
};

start();

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

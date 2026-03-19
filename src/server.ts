import { env } from "./config/env.ts";
import app from "./app.js";
import sequelize from "./core/db.connection.js";
import logger from "./utils/logger.js";

const serverLogger = logger.child({ module: "SERVER" });
const PORT = env.PORT || 3000;

const start = async () => {
    try {
        await sequelize.authenticate();
        serverLogger.info("Connection to DB successful");

        await app.listen(PORT);

        serverLogger.info({
            msg: `Server started successful on PORT ${PORT}`,
            port: PORT,
        });
    } catch (error) {
        serverLogger.fatal(error, "Failed to connect:");
        process.exit(1);
    }
};

start();

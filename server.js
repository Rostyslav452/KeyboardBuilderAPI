import { env } from "./src/config/env.js";
import app from "./src/app.js";
import { sequelize } from "./src/models/index.js";
import logger from "./src/utils/logger.js";

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
        serverLogger.fatal("Failed to connect:", error);
        process.exit(1);
    }
};

start();

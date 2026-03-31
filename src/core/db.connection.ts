import { env } from "../config/env.js";
import { Sequelize } from "sequelize";
import logger from "../config/logger.js";

const dbLogger = logger.child({ module: "DATABASE" });

const sequelize = new Sequelize(env.DB_NAME, env.DB_USERNAME, env.DB_PASSWORD, {
    host: env.DB_HOST,
    dialect: "mysql",
    logging: (sql, timing) => {
        dbLogger.debug({ duration: `${timing}ms` }, sql);
    },
});

export default sequelize;

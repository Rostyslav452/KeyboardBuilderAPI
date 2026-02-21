import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize, DataTypes } from "sequelize";
import { env as envConfig } from "../config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

import configData from "../config/config.js";
import logger from "../utils/logger.js";
const dbLogger = logger.child({ module: "DATABASE" });

const env = envConfig.NODE_ENV || "development";
const config = configData[env];

config.logging = (sql, timing) => {
    dbLogger.debug({ duration: `${timing}ms` }, sql);
};

const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config,
    );
}

const files = fs.readdirSync(__dirname).filter((file) => {
    return (
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.slice(-3) === ".js" &&
        file.indexOf(".test.js") === -1
    );
});

for (const file of files) {
    const modelPath = path.join(__dirname, file);
    const { default: modelFactory } = await import(`file://${modelPath}`);
    const model = modelFactory(sequelize, DataTypes);
    db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { sequelize, Sequelize };
export default db;

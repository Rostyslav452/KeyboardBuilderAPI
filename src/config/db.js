import { Sequelize } from "sequelize";
import envSchema from "../validators/schemas/envSchema";
import dotenv from "dotenv";

dotenv.config();

const env = envSchema.parse(process.env);

const sequelize = new Sequelize(
    env.DB_USER,
    env.DB_PASSWORD,
    env.DB_NAME,
    {
    host: process.env.DB_HOST,
    dialect: "mysql",
});

export default sequelize;

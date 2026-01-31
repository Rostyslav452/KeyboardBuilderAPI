import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import Part from "./partsModel.js";
import User from "./userModel.js";

class Build extends Model {}

Build.init(
    {
        buildId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            references: {
                key: username,
                model: User,
            },
        },
        switchId: {
            type: DataTypes.INTEGER,
            references: {
                key: "partId",
                model: Part,
            },
        },
        caseId: {
            type: DataTypes.INTEGER,
            references: {
                key: "partId",
                model: Part,
            },
        },
        pcbId: {
            type: DataTypes.INTEGER,
            references: {
                key: "partId",
                model: Part,
            },
        },
        keycapId: {
            type: DataTypes.INTEGER,
            references: {
                key: "partId",
                model: Part,
            },
        },
    },
    {
        sequelize,
        modelName: "Build",
        tableName: "builds",
        timestamps: false,
    },
);

export default Build;

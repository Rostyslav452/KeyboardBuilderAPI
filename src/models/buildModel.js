import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

class Build extends Model {}

Build.init(
    {
        buildId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING(64),
            allowNull: false,
            validate: {
                len: [3, 64],
            },
        },
        username: {
            type: DataTypes.STRING(64),
            references: {
                key: "username",
                model: "users",
            },
        },
        switchId: {
            type: DataTypes.UUID,
            references: {
                key: "partId",
                model: "parts",
            },
        },
        caseId: {
            type: DataTypes.UUID,
            references: {
                key: "partId",
                model: "parts",
            },
        },
        pcbId: {
            type: DataTypes.UUID,
            references: {
                key: "partId",
                model: "parts",
            },
        },
        keycapId: {
            type: DataTypes.UUID,
            references: {
                key: "partId",
                model: "parts",
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

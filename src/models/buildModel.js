import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Build extends Model {
        static associate(models) {
            this.belongsTo(models.Part, {
                as: "keyboardSwitch",
                foreignKey: "switchId",
            });
            this.belongsTo(models.Part, {
                as: "keyboardCase",
                foreignKey: "caseId",
            });
            this.belongsTo(models.Part, {
                as: "keyboardPCB",
                foreignKey: "pcbId",
            });
            this.belongsTo(models.Part, {
                as: "keyboardKeycap",
                foreignKey: "keycapId",
            });

            this.belongsTo(models.User, {
                foreignKey: "username",
                targetKey: "username",
            });
        }
    }

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

    return Build;
};

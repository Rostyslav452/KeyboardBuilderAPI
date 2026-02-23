import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Token extends Model {
        associate(model) {
            this.belongsTo(model.User, { foreignKey: "username" });
        }
    }

    Token.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            username: {
                type: DataTypes.STRING(64),
                references: {
                    model: "users",
                    key: "username",
                },
            },
            refreshToken: {
                type: DataTypes.STRING(512),
                allowNull: false,
            },
            expiresAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "tokens",
            modelName: "Token",
            timestamps: false,
        },
    );

    return Token;
};

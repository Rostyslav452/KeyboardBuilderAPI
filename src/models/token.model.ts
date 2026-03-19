import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
    Sequelize,
} from "sequelize";

export class Token extends Model<
    InferAttributes<Token>,
    InferCreationAttributes<Token>
> {
    declare id: CreationOptional<string>;
    declare username: string;
    declare refreshToken: string;
    declare expiresAt: Date;
}

export const initTokenModel = (sequelize: Sequelize) => {
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

import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
    Sequelize,
} from "sequelize";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";

export class Token extends Model<
    InferAttributes<Token>,
    InferCreationAttributes<Token>
> {
    declare id: CreationOptional<string>;
    declare username: string;
    declare refreshToken: string;
    declare expiresAt: Date;

    compareToken(candidateToken: string) {
      return bcrypt.compare(candidateToken, this.refreshToken);
   }
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
            hooks:{
               beforeSave: async(token) =>{
                  if(token.refreshToken && token.changed("refreshToken")){
                     token.refreshToken = await bcrypt.hash(token.refreshToken, env.SALT_ROUNDS);
                  }
               }
            }
        },
    );

    return Token;
};

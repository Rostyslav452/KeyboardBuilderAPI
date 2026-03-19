import {
    Model,
    Sequelize,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import bcrypt from "bcryptjs";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare username: string;
    declare password: string;

    comparePassword(candidatePassword: string) {
        return bcrypt.compare(candidatePassword, this.password);
    }
}

export const initUserModel = (sequelize: Sequelize) => {
    User.init(
        {
            username: {
                type: DataTypes.STRING(64),
                primaryKey: true,
                validate: {
                    len: [3, 64],
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "User",
            tableName: "users",
            timestamps: false,
            hooks: {
                beforeSave: async (user) => {
                    if (user.password && user.changed("password")) {
                        const saltRounds =
                            Number(process.env.SALT_ROUNDS) || 10;
                        user.password = await bcrypt.hash(
                            user.password,
                            saltRounds,
                        );
                    }
                },
            },
        },
    );

    return User;
};

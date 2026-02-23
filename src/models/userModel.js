import { Model } from "sequelize";
import bcrypt from "bcryptjs";

export default (sequelize, DataTypes) => {
    class User extends Model {
        comparePassword(candidatePassword) {
            return bcrypt.compare(candidatePassword, this.password);
        }

        static associate(models) {
            this.hasMany(models.Build, { foreignKey: "username" });
            this.hasMany(model.Token, { foreignKey: "username" });
        }
    }

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

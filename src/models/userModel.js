import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";
import bcrypt from "bcryptjs";

class User extends Model {
    comparePassword(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
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
                    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
                    user.password = await bcrypt.hash(
                        user.password,
                        saltRounds,
                    );
                }
            },
        },
    },
);

export default User;

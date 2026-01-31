import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";

class User extends Model {}

User.init(
    {
        username: {
            type: DataTypes.STRING,
            primaryKey: true,
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
    },
);


// class UserBuild extends Model {}
//
// UserBuild.init(
//     {
//         username: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             references: {
//                 key: "username",
//                 model: User,
//             },
//         },
//         buildId: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             unique: true,
//             references: {
//                 key: "buildId",
//                 model: Build,
//             },
//         },
//     },
//     {
//         sequelize,
//         modelName: "UserBuild",
//         tableName: "usersBuilds",
//         timestamps: false,
//     },
// );

// UserBuild.belongsToMany(User, { foreignKey: "username" });
// UserBuild.belongsTo(Build, { foreignKey: "buildId" });

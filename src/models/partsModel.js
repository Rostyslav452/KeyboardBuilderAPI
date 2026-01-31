import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";

class Part extends Model {}

Part.init(
    {
        partId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        type: {
            type: DataTypes.ENUM(["switch", "case", "pcb", "keycap"]),
            allowNull: false,
        },
        specs: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
        },
    },
    {
        sequelize,
        modelName: "Part",
        tableName: "parts",
        timestamps: false,
    },
);


export default Part;

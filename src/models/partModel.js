import {  Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Part extends Model {
     }

    Part.init(
        {
            partId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                type: DataTypes.STRING(64),
                allowNull: false,
                unique: true,
                validate: {
                    len: [3, 64],
                },
            },
            type: {
                type: DataTypes.ENUM(["switch", "case", "pcb", "keycap"]),
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(8, 2),
                allowNull: false,
                validate: {
                    min: 1,
                    max: 99999,
                },
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

    return Part;
}

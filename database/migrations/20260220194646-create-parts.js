"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("parts", {
            partId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            name: {
                type: Sequelize.STRING(64),
                allowNull: false,
                unique: true,
            },
            type: {
                type: Sequelize.ENUM(["switch", "case", "pcb", "keycap"]),
                allowNull: false,
            },
            price: {
                type: Sequelize.DECIMAL(8, 2),
                allowNull: false,
            },
            specs: {
                type: Sequelize.JSON,
                allowNull: false,
                defaultValue: {},
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("parts");
    },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface) {
        const table = await queryInterface.describeTable("tokens");

        if (table.expiresIn) {
            await queryInterface.removeColumn("tokens", "expiresIn");
        }
    },

    async down(queryInterface, Sequelize) {
        const table = await queryInterface.describeTable("tokens");

        if (!table.expiresIn) {
            await queryInterface.addColumn("tokens", "expiresIn", {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            });
        }
    },
};

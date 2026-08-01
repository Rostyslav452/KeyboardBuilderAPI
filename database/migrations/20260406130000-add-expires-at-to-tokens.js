"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        const table = await queryInterface.describeTable("tokens");

        if (table.expiresIn && !table.expiresAt) {
            await queryInterface.renameColumn(
                "tokens",
                "expiresIn",
                "expiresAt",
            );
            return;
        }

        if (!table.expiresAt) {
            await queryInterface.addColumn("tokens", "expiresAt", {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            });
        }

        if (table.expiresIn) {
            await queryInterface.sequelize.query(
                "UPDATE tokens SET expiresAt = expiresIn WHERE expiresIn IS NOT NULL",
            );
            await queryInterface.removeColumn("tokens", "expiresIn");
        }
    },

    async down(queryInterface) {
        const table = await queryInterface.describeTable("tokens");

        if (!table.expiresIn && table.expiresAt) {
            await queryInterface.renameColumn(
                "tokens",
                "expiresAt",
                "expiresIn",
            );
            return;
        }

        if (table.expiresAt) {
            await queryInterface.removeColumn("tokens", "expiresAt");
        }
    },
};

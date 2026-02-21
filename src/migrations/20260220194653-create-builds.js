"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("builds", {
            buildId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            name: {
                type: Sequelize.STRING(64),
                allowNull: false,
            },
            username: {
                type: Sequelize.STRING(64),
                references: {
                    key: "username",
                    model: "users",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            switchId: {
                type: Sequelize.UUID,
                references: {
                    key: "partId",
                    model: "parts",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            caseId: {
                type: Sequelize.UUID,
                references: {
                    key: "partId",
                    model: "parts",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            pcbId: {
                type: Sequelize.UUID,
                references: {
                    key: "partId",
                    model: "parts",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            keycapId: {
                type: Sequelize.UUID,
                references: {
                    key: "partId",
                    model: "parts",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("builds");
    },
};

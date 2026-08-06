"use strict";

const bcrypt = require("bcrypt");

const users = [
    { username: "rostyslav", password: "Rostyslav123" },
    { username: "olena", password: "Olena123" },
    { username: "taras", password: "Taras123" },
    { username: "admin_demo", password: "Admin123" },
];

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const existingUsers = await queryInterface.sequelize.query(
            `SELECT username FROM users WHERE username IN (:usernames)`,
            {
                replacements: {
                    usernames: users.map((user) => user.username),
                },
                type: Sequelize.QueryTypes.SELECT,
            },
        );

        const existingUsernames = new Set(
            existingUsers.map((user) => user.username),
        );

        const hashedUsers = await Promise.all(
            users
                .filter((user) => !existingUsernames.has(user.username))
                .map(async ({ username, password }) => ({
                    username,
                    password: await bcrypt.hash(password, 10),
                })),
        );

        if (hashedUsers.length === 0) {
            return;
        }

        return queryInterface.bulkInsert("users", hashedUsers);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete(
            "users",
            {
                username: {
                    [Sequelize.Op.in]: users.map((user) => user.username),
                },
            },
            {},
        );
    },
};

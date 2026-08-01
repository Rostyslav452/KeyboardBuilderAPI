"use strict";

const crypto = require("crypto");

const buildDefinitions = [
    {
        name: "Rostyslav Daily 75",
        username: "rostyslav",
        switchName: "HMX Violet",
        caseName: "Rainy75",
        pcbName: "PCBlegend",
        keycapName: "GMK Laser",
    },
    {
        name: "Olena Silent 65",
        username: "olena",
        switchName: "Bobagum Silent",
        caseName: "Zoom65",
        pcbName: "BM65 RGB",
        keycapName: "Osume Sakura",
    },
    {
        name: "Taras TKL Office",
        username: "taras",
        switchName: "Cherry MX Red",
        caseName: "Frog TKL",
        pcbName: "SUO TKL",
        keycapName: "EPBT Kuro Shiro",
    },
    {
        name: "Admin Showcase 60",
        username: "admin_demo",
        switchName: "NovelKeys Cream",
        caseName: "Tofu60",
        pcbName: "DZ60 RGB",
        keycapName: "GMK Botanical",
    },
];

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const partNames = [
            ...new Set(
                buildDefinitions.flatMap((build) => [
                    build.switchName,
                    build.caseName,
                    build.pcbName,
                    build.keycapName,
                ]),
            ),
        ];

        const parts = await queryInterface.sequelize.query(
            `SELECT partId, name, type FROM parts WHERE name IN (:partNames)`,
            {
                replacements: { partNames },
                type: Sequelize.QueryTypes.SELECT,
            },
        );

        const partMap = new Map(
            parts.map((part) => [`${part.type}:${part.name}`, part.partId]),
        );

        const existingBuilds = await queryInterface.sequelize.query(
            `SELECT name FROM builds WHERE name IN (:buildNames)`,
            {
                replacements: {
                    buildNames: buildDefinitions.map((build) => build.name),
                },
                type: Sequelize.QueryTypes.SELECT,
            },
        );

        const existingBuildNames = new Set(
            existingBuilds.map((build) => build.name),
        );

        const builds = buildDefinitions
            .filter((build) => !existingBuildNames.has(build.name))
            .map((build) => {
                const switchId = partMap.get(`switch:${build.switchName}`);
                const caseId = partMap.get(`case:${build.caseName}`);
                const pcbId = partMap.get(`pcb:${build.pcbName}`);
                const keycapId = partMap.get(`keycap:${build.keycapName}`);

                if (!switchId || !caseId || !pcbId || !keycapId) {
                    throw new Error(`Missing parts for build: ${build.name}`);
                }

                return {
                    buildId: crypto.randomUUID(),
                    name: build.name,
                    username: build.username,
                    switchId,
                    caseId,
                    pcbId,
                    keycapId,
                };
            });

        if (builds.length === 0) {
            return;
        }

        return queryInterface.bulkInsert("builds", builds);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete(
            "builds",
            {
                name: {
                    [Sequelize.Op.in]: buildDefinitions.map(
                        (build) => build.name,
                    ),
                },
            },
            {},
        );
    },
};

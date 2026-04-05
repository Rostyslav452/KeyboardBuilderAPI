"use strict";
const crypto = require("crypto");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const parts = [];

        const switchNames = [
            "HMX Violet",
            "JWK WOB",
            "Gateron Oil King",
            "Cherry MX Red",
            "Akko Lavender",
            "Bobagum Silent",
            "Holy Panda",
            "NovelKeys Cream",
            "KTT Strawberry",
            "Tangerine V2",
        ];
        switchNames.forEach((name, i) => {
            parts.push({
                partId: crypto.randomUUID(),
                name: name,
                type: "switch",
                price: 15 + i * 2,
                specs: JSON.stringify({
                    switchType: i % 2 === 0 ? "Linear" : "Tactile",
                    pins: i % 3 === 0 ? "3-pin" : "5-pin",
                    actuationForce: 40 + i * 5,
                    travelDistance: 3.5,
                }),
            });
        });

        const caseNames = [
            "Rainy75",
            "Bridge75",
            "Tofu60",
            "Keychron Q1",
            "Mode Envoy",
            "Frog TKL",
            "Zoom65",
            "Bakeneko60",
            "KBD8X",
            "Luminkey65",
        ];
        const materials = [
            "Aluminum",
            "Polycarbonate",
            "Acrylic",
            "PBT",
            "ABS",
        ];
        const formFactors = ["60%", "65%", "75%", "TKL", "Full-size"];

        caseNames.forEach((name, i) => {
            parts.push({
                partId: crypto.randomUUID(),
                name: name,
                type: "case",
                price: 80 + i * 15,
                specs: JSON.stringify({
                    formFactor: formFactors[i % formFactors.length],
                    material: materials[i % materials.length],
                    color: i % 2 === 0 ? "Black" : "Silver",
                    mountStyle: "Gasket Mount",
                }),
            });
        });

        const pcbNames = [
            "PCBlegend",
            "WT60-D",
            "DZ60 RGB",
            "BM65 RGB",
            "KBD75 Rev 2.0",
            "SUO TKL",
            "Hineuni 60",
            "Apex 65",
            "Gingham PCB",
            "Romeo 40",
        ];
        pcbNames.forEach((name, i) => {
            parts.push({
                partId: crypto.randomUUID(),
                name: name,
                type: "pcb",
                price: 40 + i * 10,
                specs: JSON.stringify({
                    formFactor: formFactors[i % formFactors.length],
                    hotSwap: i % 4 !== 0,
                    rgbSupport: i % 2 === 0 ? "per-key" : "none",
                    connection: ["USB-C"],
                }),
            });
        });

        const keycapNames = [
            "GMK Laser",
            "GMK Botanical",
            "PBT Fans Retro",
            "Drop MT3 Camo",
            "EPBT Kuro Shiro",
            "NicePBT Greyish",
            "Osume Sakura",
            "Akko Carbon",
            "SA Mizu",
            "XDA Marshmallow",
        ];
        const profiles = ["Cherry", "OEM", "SA", "XDA", "DSA"];

        keycapNames.forEach((name, i) => {
            parts.push({
                partId: crypto.randomUUID(),
                name: name,
                type: "keycap",
                price: 30 + i * 12,
                specs: JSON.stringify({
                    profile: profiles[i % profiles.length],
                    material: i % 2 === 0 ? "PBT" : "ABS",
                    legends: "Double-shot",
                    language: ["EN", "UA"],
                }),
            });
        });

        const existingParts = await queryInterface.sequelize.query(
            `SELECT name FROM parts WHERE name IN (:partNames)`,
            {
                replacements: { partNames: parts.map((part) => part.name) },
                type: Sequelize.QueryTypes.SELECT,
            },
        );

        const existingNames = new Set(existingParts.map((part) => part.name));

        const newParts = parts.filter((part) => !existingNames.has(part.name));

        if (newParts.length === 0) {
            return;
        }

        return queryInterface.bulkInsert("parts", newParts);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("parts", null, {});
    },
};

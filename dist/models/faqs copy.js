"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const sequelize = new sequelize_1.Sequelize(...config_1.env.database);
const tbl_faqs = sequelize.define("tbl_faqs", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    question_ar: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    question_en: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    ansower_ar: { type: sequelize_1.DataTypes.TEXT, allowNull: false, defaultValue: 0 },
    ansower_en: { type: sequelize_1.DataTypes.TEXT, allowNull: false, defaultValue: 0 },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    charset: "utf8",
    collate: "utf8_general_ci",
    scopes: {
        active: {
            where: {
                active: true,
            },
        },
        notActive: {
            where: {
                active: false,
            },
        },
    },
});
tbl_faqs.sync();
exports.default = tbl_faqs;

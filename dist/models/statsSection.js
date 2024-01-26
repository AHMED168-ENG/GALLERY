"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const sequelize = new sequelize_1.Sequelize(...config_1.env.database);
const tbl_stats_section = sequelize.define("tbl_stats_section", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    text_one_ar: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    text_one_en: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    icon_one: { type: sequelize_1.DataTypes.TEXT, allowNull: false, defaultValue: 0 },
    text_tow_ar: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    text_tow_en: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    icon_tow: { type: sequelize_1.DataTypes.TEXT, allowNull: false, defaultValue: 0 },
    text_three_ar: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    text_three_en: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    icon_three: { type: sequelize_1.DataTypes.TEXT, allowNull: false, defaultValue: 0 },
    text_four_ar: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    text_four_en: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    icon_four: { type: sequelize_1.DataTypes.TEXT, allowNull: false, defaultValue: 0 },
}, {
    charset: "utf8",
    collate: "utf8_general_ci",
});
tbl_stats_section.sync();
exports.default = tbl_stats_section;

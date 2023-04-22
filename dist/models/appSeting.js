"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const sequelize = new sequelize_1.Sequelize(...config_1.env.database);
const tbl_app_settings = sequelize.define("tbl_app_settings", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
    },
    summary_ar: { type: sequelize_1.DataTypes.TEXT },
    summary_en: { type: sequelize_1.DataTypes.TEXT },
    addres_ar: { type: sequelize_1.DataTypes.STRING },
    addres_en: { type: sequelize_1.DataTypes.STRING },
    sitName_ar: { type: sequelize_1.DataTypes.STRING },
    sitName_en: { type: sequelize_1.DataTypes.STRING },
    companyNickName: { type: sequelize_1.DataTypes.STRING },
    slogan: { type: sequelize_1.DataTypes.STRING },
    websiteAddress: { type: sequelize_1.DataTypes.STRING },
    officialEmail: { type: sequelize_1.DataTypes.STRING },
    phoneNumber: { type: sequelize_1.DataTypes.STRING },
    mobile: { type: sequelize_1.DataTypes.STRING },
    fax: { type: sequelize_1.DataTypes.STRING },
    facebookLink: { type: sequelize_1.DataTypes.STRING },
    twitterLink: { type: sequelize_1.DataTypes.STRING },
    instagramLink: { type: sequelize_1.DataTypes.STRING },
    pinterestLink: { type: sequelize_1.DataTypes.STRING },
    YoutubeLink: { type: sequelize_1.DataTypes.STRING },
    metakeywords_ar: { type: sequelize_1.DataTypes.TEXT },
    metakeywords_en: { type: sequelize_1.DataTypes.TEXT },
    metaDescription_ar: { type: sequelize_1.DataTypes.TEXT },
    metaDescription_en: { type: sequelize_1.DataTypes.TEXT },
    active: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    ifream: { type: sequelize_1.DataTypes.TEXT },
    logo: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
}, { charset: "utf8", collate: "utf8_general_ci" });
tbl_app_settings.sync();
exports.default = tbl_app_settings;

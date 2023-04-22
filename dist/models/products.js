"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const categorys_1 = __importDefault(require("./categorys"));
const sequelize = new sequelize_1.Sequelize(...config_1.env.database);
const tbl_products = sequelize.define("tbl_products", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    productName_ar: { type: sequelize_1.DataTypes.STRING },
    productName_en: { type: sequelize_1.DataTypes.STRING },
    productOverview_ar: { type: sequelize_1.DataTypes.STRING },
    productOverview_en: { type: sequelize_1.DataTypes.STRING },
    fullDescription_ar: { type: sequelize_1.DataTypes.TEXT },
    fullDescription_en: { type: sequelize_1.DataTypes.TEXT },
    statmentDescription_ar: { type: sequelize_1.DataTypes.TEXT },
    statmentDescription_en: { type: sequelize_1.DataTypes.TEXT },
    price: { type: sequelize_1.DataTypes.INTEGER },
    shipping: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    category: { type: sequelize_1.DataTypes.INTEGER },
    productImage: { type: sequelize_1.DataTypes.STRING },
    descriptionImage: { type: sequelize_1.DataTypes.TEXT },
    keyWord: { type: sequelize_1.DataTypes.TEXT },
    descount: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    active: { type: sequelize_1.DataTypes.BOOLEAN },
    sumRate: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    structure: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    productVideo: { type: sequelize_1.DataTypes.STRING },
    slug_ar: {
        type: sequelize_1.DataTypes.STRING,
    },
    slug_en: {
        type: sequelize_1.DataTypes.STRING,
    },
    metaDescription_ar: {
        type: sequelize_1.DataTypes.TEXT,
    },
    metaDescription_en: {
        type: sequelize_1.DataTypes.TEXT,
    },
    metaKeywords_ar: {
        type: sequelize_1.DataTypes.TEXT,
    },
    metaKeywords_en: {
        type: sequelize_1.DataTypes.TEXT,
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
tbl_products.sync();
categorys_1.default.hasMany(tbl_products, {
    as: "products",
    foreignKey: "category",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
tbl_products.belongsTo(categorys_1.default, {
    as: "ProductCategory",
    foreignKey: "category",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
exports.default = tbl_products;

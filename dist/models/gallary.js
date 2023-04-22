"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const products_1 = __importDefault(require("./products"));
const sequelize = new sequelize_1.Sequelize(...config_1.env.database);
const tbl_gallary = sequelize.define("tbl_gallary", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    image: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    productId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    title_ar: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: 0 },
    title_en: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: 0 },
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
tbl_gallary.sync();
tbl_gallary.belongsTo(products_1.default, {
    as: "gallaryProduct",
    foreignKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
exports.default = tbl_gallary;

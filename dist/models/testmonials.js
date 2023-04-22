"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const users_1 = __importDefault(require("./users"));
const sequelize = new sequelize_1.Sequelize(...config_1.env.database);
const tbl_testmonials = sequelize.define("tbl_testmonials", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
    },
    testmonial_en: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    testmonial_ar: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    rate: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
tbl_testmonials.sync();
tbl_testmonials.belongsTo(users_1.default, {
    as: "testmonialsUser",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
users_1.default.hasMany(tbl_testmonials, {
    as: "userTestmonials",
    foreignKey: "userId",
});
exports.default = tbl_testmonials;

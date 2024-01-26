"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const users_1 = __importDefault(require("./users"));
const products_1 = __importDefault(require("./products"));
const sequelize = new sequelize_1.Sequelize(...config_1.env.database);
const tbl_rate = sequelize.define("tbl_rate", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    rate: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER,
    },
}, {
    charset: "utf8",
    collate: "utf8_general_ci",
});
tbl_rate.sync();
products_1.default.hasMany(tbl_rate, {
    as: "allRate",
    foreignKey: "productId",
});
tbl_rate.belongsTo(users_1.default, {
    as: "rateUser",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
exports.default = tbl_rate;

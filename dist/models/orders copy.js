"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const users_1 = __importDefault(require("./users"));
const sequelize = new sequelize_1.Sequelize(...config_1.env.database);
const tbl_orders = sequelize.define("tbl_orders", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    productsId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    productsCount: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    orderState: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
    },
}, {
    charset: "utf8",
    collate: "utf8_general_ci",
});
tbl_orders.sync();
tbl_orders.belongsTo(users_1.default, {
    as: "orderUser",
    foreignKey: "userId",
});
exports.default = tbl_orders;

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
    isSeen: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isFinished: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    charset: "utf8",
    collate: "utf8_general_ci",
    scopes: {
        NotSeen: {
            where: {
                isSeen: false,
            },
        },
        notActive: {
            where: {
                active: false,
            },
        },
    },
});
tbl_orders.sync();
tbl_orders.belongsTo(users_1.default, {
    as: "orderUser",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
users_1.default.hasMany(tbl_orders, {
    as: "userOrders",
    foreignKey: "userId",
});
exports.default = tbl_orders;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const products_1 = __importDefault(require("./products"));
const sequelize = new sequelize_1.Sequelize(...config_1.env.database);
const tbl_productsOrder = sequelize.define("tbl_productsorder", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    orderId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    productCount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
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
tbl_productsOrder.sync();
tbl_productsOrder.belongsTo(products_1.default, {
    as: "productTable",
    foreignKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
exports.default = tbl_productsOrder;

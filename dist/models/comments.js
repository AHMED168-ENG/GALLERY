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
const tbl_comments = sequelize.define("tbl_comments", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    comment: {
        type: sequelize_1.DataTypes.TEXT,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    active: {
        defaultValue: true,
        type: sequelize_1.DataTypes.BOOLEAN,
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
products_1.default.hasMany(tbl_comments, {
    as: "allComments",
    foreignKey: "productId",
});
tbl_comments.belongsTo(users_1.default, {
    as: "commentUser",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
tbl_comments.belongsTo(products_1.default, {
    as: "commentProduct",
    foreignKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
tbl_comments.sync();
exports.default = tbl_comments;

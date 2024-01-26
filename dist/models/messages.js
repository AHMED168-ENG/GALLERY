"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const users_1 = __importDefault(require("./users"));
const sequelize = new sequelize_1.Sequelize(...config_1.env.database);
const tbl_messages = sequelize.define("tbl_messages", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    subject: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    message: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    isSeen: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    charset: "utf8",
    collate: "utf8_general_ci",
    scopes: {
        isSeen: {
            where: {
                isSeen: true,
            },
        },
        notSeen: {
            where: {
                isSeen: false,
            },
        },
    },
});
tbl_messages.sync();
tbl_messages.belongsTo(users_1.default, {
    as: "messageUser",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
exports.default = tbl_messages;

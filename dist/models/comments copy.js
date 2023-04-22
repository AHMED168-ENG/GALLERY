"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const users_1 = __importDefault(require("./users"));
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
        mainCategorys: {
            where: {
                mainCatigory: 0,
            },
        },
        supCategorys: {
            where: {
                mainCatigory: { [sequelize_1.Op.ne]: 0 },
            },
        },
    },
});
tbl_comments.sync();
users_1.default.hasMany(tbl_comments, {
    as: "allComments",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
tbl_comments.belongsTo(users_1.default, {
    as: "commentUset",
    foreignKey: "userId",
});
exports.default = tbl_comments;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const sequelize = new sequelize_1.Sequelize(...config_1.env.database);
const tbl_favorets = sequelize.define("tbl_favorets", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    userId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    productId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
}, {
    charset: "utf8",
    collate: "utf8_general_ci",
});
tbl_favorets.sync();
exports.default = tbl_favorets;

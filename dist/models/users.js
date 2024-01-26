"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const sequelize = new sequelize_1.Sequelize(...config_1.env.database);
const tbl_users = sequelize.define("tbl_users", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    fName: {
        type: sequelize_1.DataTypes.STRING,
    },
    lName: {
        type: sequelize_1.DataTypes.STRING,
    },
    age: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
    },
    roles: {
        type: sequelize_1.DataTypes.ENUM(),
        values: ["User", "Admin", "SuperAdmin"],
    },
    mobile: {
        type: sequelize_1.DataTypes.STRING,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
    },
    resetToken: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
    },
    resetTokenExpiration: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
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
        notActive: {
            where: {
                active: false,
            },
        },
    },
});
tbl_users.sync();
exports.default = tbl_users;

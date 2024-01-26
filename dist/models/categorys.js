"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const sequelize = new sequelize_1.Sequelize(...config_1.env.database);
const tbl_categorys = sequelize.define("tbl_categorys", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    category_ar: {
        type: sequelize_1.DataTypes.STRING,
    },
    category_en: {
        type: sequelize_1.DataTypes.STRING,
    },
    description_ar: {
        type: sequelize_1.DataTypes.TEXT,
    },
    description_en: {
        type: sequelize_1.DataTypes.TEXT,
    },
    slug_ar: {
        type: sequelize_1.DataTypes.STRING,
    },
    slug_en: {
        type: sequelize_1.DataTypes.STRING,
    },
    metaDescription_ar: {
        type: sequelize_1.DataTypes.TEXT,
    },
    metaDescription_en: {
        type: sequelize_1.DataTypes.TEXT,
    },
    metaKeywords_ar: {
        type: sequelize_1.DataTypes.TEXT,
    },
    metaKeywords_en: {
        type: sequelize_1.DataTypes.TEXT,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
    },
    mainCatigory: {
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
        notActive: {
            where: {
                active: false,
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
tbl_categorys.sync();
tbl_categorys.hasMany(tbl_categorys, {
    as: "allSupCategorys",
    foreignKey: "mainCatigory",
});
tbl_categorys.belongsTo(tbl_categorys, {
    as: "mainCatigorys",
    foreignKey: "mainCatigory",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
exports.default = tbl_categorys;

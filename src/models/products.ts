import { DataTypes, Op, Sequelize } from "sequelize";
import { env } from "../config/config";
import tbl_categorys from "./categorys";
const sequelize = new Sequelize(...env.database);
const tbl_products = sequelize.define(
  "tbl_products",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    productName_ar: { type: DataTypes.STRING },
    productName_en: { type: DataTypes.STRING },
    productOverview_ar: { type: DataTypes.STRING },
    productOverview_en: { type: DataTypes.STRING },
    fullDescription_ar: { type: DataTypes.TEXT },
    fullDescription_en: { type: DataTypes.TEXT },
    statmentDescription_ar: { type: DataTypes.TEXT },
    statmentDescription_en: { type: DataTypes.TEXT },
    price: { type: DataTypes.INTEGER },
    shipping: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    category: { type: DataTypes.INTEGER },
    productImage: { type: DataTypes.STRING },
    descriptionImage: { type: DataTypes.TEXT },
    keyWord: { type: DataTypes.TEXT },
    descount: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    active: { type: DataTypes.BOOLEAN },
    sumRate: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    structure: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    productVideo: { type: DataTypes.STRING },
    slug_ar: {
      type: DataTypes.STRING,
    },
    slug_en: {
      type: DataTypes.STRING,
    },
    metaDescription_ar: {
      type: DataTypes.TEXT,
    },
    metaDescription_en: {
      type: DataTypes.TEXT,
    },
    metaKeywords_ar: {
      type: DataTypes.TEXT,
    },
    metaKeywords_en: {
      type: DataTypes.TEXT,
    },
  },
  {
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
  }
);
tbl_products.sync();
tbl_categorys.hasMany(tbl_products, {
  as: "products",
  foreignKey: "category",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
tbl_products.belongsTo(tbl_categorys, {
  as: "ProductCategory",
  foreignKey: "category",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default tbl_products;

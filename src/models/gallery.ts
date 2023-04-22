import { DataTypes, Sequelize } from "sequelize";
import { env } from "../config/config";
import tbl_products from "./products";
const sequelize = new Sequelize(...env.database);
const tbl_gallery = sequelize.define(
  "tbl_gallery",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    image: { type: DataTypes.STRING, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    title_ar: { type: DataTypes.STRING, allowNull: false, defaultValue: 0 },
    title_en: { type: DataTypes.STRING, allowNull: false, defaultValue: 0 },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
tbl_gallery.belongsTo(tbl_products, {
  as: "galleryProduct",
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
tbl_gallery.sync();
export default tbl_gallery;

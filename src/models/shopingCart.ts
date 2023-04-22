import { DataTypes, Sequelize } from "sequelize";
import { env } from "../config/config";
import tbl_products from "./products";
const sequelize = new Sequelize(...env.database);
const tbl_shopingcart = sequelize.define(
  "tbl_shopingcart",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    count: { type: DataTypes.INTEGER, allowNull: false },
    finishingTime: { type: DataTypes.BIGINT, allowNull: false },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);
tbl_shopingcart.sync();
tbl_shopingcart.belongsTo(tbl_products, {
  as: "cartProduct",
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
export default tbl_shopingcart;

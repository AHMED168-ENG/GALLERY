import { DataTypes, Sequelize } from "sequelize";
import { env } from "../config/config";
import tbl_products from "./products";
const sequelize = new Sequelize(...env.database);
const tbl_favorits = sequelize.define(
  "tbl_favorits",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);
tbl_favorits.sync();
tbl_favorits.belongsTo(tbl_products, {
  as: "favoritProduct",
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default tbl_favorits;

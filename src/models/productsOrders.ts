import { DataTypes, Sequelize } from "sequelize";
import { env } from "../config/config";
import tbl_orders from "./orders";
import tbl_products from "./products";
const sequelize = new Sequelize(...env.database);
const tbl_productsOrder = sequelize.define(
  "tbl_productsOrder",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
    scopes: {
      NotSeen: {
        where: {
          isSeen: false,
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
tbl_productsOrder.sync();

tbl_productsOrder.belongsTo(tbl_products, {
  as: "productTable",
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
export default tbl_productsOrder;

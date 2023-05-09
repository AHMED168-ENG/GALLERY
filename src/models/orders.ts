import { DataTypes, Sequelize } from "sequelize";
import { env } from "../config/config";
import tbl_users from "./users";
import tbl_productsOrder from "./productsOrders";
const sequelize = new Sequelize(...env.database);
const tbl_orders = sequelize.define(
  "tbl_orders",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    isSeen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isFinished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
tbl_orders.sync();
tbl_orders.belongsTo(tbl_users, {
  as: "orderUser",
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
tbl_orders.hasMany(tbl_productsOrder, {
  as: "productOrderTable",
  foreignKey: "orderId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
tbl_users.hasMany(tbl_orders, {
  as: "userOrders",
  foreignKey: "userId",
});
export default tbl_orders;

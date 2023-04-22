import { DataTypes, Op, Sequelize } from "sequelize";
import { env } from "../config/config";
import tbl_users from "./users";
import tbl_products from "./products";
const sequelize = new Sequelize(...env.database);
const tbl_rate = sequelize.define(
  "tbl_rate",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    rate: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    productId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);
tbl_rate.sync();
tbl_products.hasMany(tbl_rate, {
  as: "allRate",
  foreignKey: "productId",
});

tbl_rate.belongsTo(tbl_users, {
  as: "rateUser",
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// tbl_users.hasMany(tbl_rate, {
//   as: "userRate",
//   foreignKey: "userId",
//   onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// });

export default tbl_rate;

import { DataTypes, Op, Sequelize } from "sequelize";
import { env } from "../config/config";
import tbl_users from "./users";
import tbl_products from "./products";
const sequelize = new Sequelize(...env.database);
const tbl_comments = sequelize.define(
  "tbl_comments",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    comment: {
      type: DataTypes.TEXT,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    productId: {
      type: DataTypes.INTEGER,
    },
    active: {
      defaultValue: true,
      type: DataTypes.BOOLEAN,
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
tbl_comments.sync();
tbl_products.hasMany(tbl_comments, {
  as: "allComments",
  foreignKey: "productId",
});
tbl_comments.belongsTo(tbl_users, {
  as: "commentUser",
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
tbl_comments.belongsTo(tbl_products, {
  as: "commentProduct",
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default tbl_comments;

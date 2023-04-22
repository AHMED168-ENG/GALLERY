import { DataTypes, Sequelize } from "sequelize";
import { env } from "../config/config";
import tbl_users from "./users";
const sequelize = new Sequelize(...env.database);
const tbl_testmonials = sequelize.define(
  "tbl_testmonials",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true,
    },
    testmonial_en: { type: DataTypes.TEXT, allowNull: false },
    testmonial_ar: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    rate: { type: DataTypes.INTEGER, allowNull: false },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
tbl_testmonials.sync();
tbl_testmonials.belongsTo(tbl_users, {
  as: "testmonialsUser",
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
tbl_users.hasMany(tbl_testmonials, {
  as: "userTestmonials",
  foreignKey: "userId",
});
export default tbl_testmonials;

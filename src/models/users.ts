import { DataTypes, Sequelize } from "sequelize";
import { env } from "../config/config";
const sequelize = new Sequelize(...env.database);
const tbl_users = sequelize.define(
  "tbl_users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },

    fName: {
      type: DataTypes.STRING,
    },
    lName: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    roles: {
      type: DataTypes.ENUM(),
      values: ["User", "Admin", "SuperAdmin"],
    },
    //   isVendor: DataTypes.BOOLEAN,
    mobile: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    active: {
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
tbl_users.sync();
export default tbl_users;

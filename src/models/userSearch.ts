import { DataTypes, Sequelize } from "sequelize";
import { env } from "../config/config";
const sequelize = new Sequelize(...env.database);
const tbl_user_search = sequelize.define(
  "tbl_user_search",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userId: { type: DataTypes.INTEGER },
    search: { type: DataTypes.STRING },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);
tbl_user_search.sync();
export default tbl_user_search;

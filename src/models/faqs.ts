import { DataTypes, Sequelize } from "sequelize";
import { env } from "../config/config";
const sequelize = new Sequelize(...env.database);
const tbl_faqs = sequelize.define(
  "tbl_faqs",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    question_ar: { type: DataTypes.STRING, allowNull: false },
    question_en: { type: DataTypes.STRING, allowNull: false },
    ansower_ar: { type: DataTypes.TEXT, allowNull: false, defaultValue: 0 },
    ansower_en: { type: DataTypes.TEXT, allowNull: false, defaultValue: 0 },
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
tbl_faqs.sync();
export default tbl_faqs;

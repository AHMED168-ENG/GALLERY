import { DataTypes, Sequelize } from "sequelize";
import { env } from "../config/config";
const sequelize = new Sequelize(...env.database);
const tbl_stats_section = sequelize.define(
  "tbl_stats_section",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    text_one_ar: { type: DataTypes.STRING, allowNull: false },
    text_one_en: { type: DataTypes.STRING, allowNull: false },
    icon_one: { type: DataTypes.TEXT, allowNull: false, defaultValue: 0 },
    text_tow_ar: { type: DataTypes.STRING, allowNull: false },
    text_tow_en: { type: DataTypes.STRING, allowNull: false },
    icon_tow: { type: DataTypes.TEXT, allowNull: false, defaultValue: 0 },
    text_three_ar: { type: DataTypes.STRING, allowNull: false },
    text_three_en: { type: DataTypes.STRING, allowNull: false },
    icon_three: { type: DataTypes.TEXT, allowNull: false, defaultValue: 0 },
    text_four_ar: { type: DataTypes.STRING, allowNull: false },
    text_four_en: { type: DataTypes.STRING, allowNull: false },
    icon_four: { type: DataTypes.TEXT, allowNull: false, defaultValue: 0 },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);
tbl_stats_section.sync();
export default tbl_stats_section;

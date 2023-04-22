import { DataTypes, Sequelize } from "sequelize";
import { env } from "../config/config";
const sequelize = new Sequelize(...env.database);
const tbl_sliders = sequelize.define(
  "tbl_sliders",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    position: { type: DataTypes.STRING },
    header_ar: { type: DataTypes.STRING },
    header_en: { type: DataTypes.STRING },
    description_ar: { type: DataTypes.STRING },
    description_en: { type: DataTypes.STRING },
    link: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    active: { type: DataTypes.BOOLEAN },
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
tbl_sliders.sync();
export default tbl_sliders;

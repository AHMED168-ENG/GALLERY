import { DataTypes, Op, Sequelize } from "sequelize";
import { env } from "../config/config";
const sequelize = new Sequelize(...env.database);
const tbl_app_settings = sequelize.define(
  "tbl_app_settings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true,
    },
    summary_ar: { type: DataTypes.TEXT },
    summary_en: { type: DataTypes.TEXT },
    addres_ar: { type: DataTypes.STRING },
    addres_en: { type: DataTypes.STRING },
    // Basic information:
    sitName_ar: { type: DataTypes.STRING },
    sitName_en: { type: DataTypes.STRING },
    companyNickName: { type: DataTypes.STRING },
    slogan: { type: DataTypes.STRING },
    websiteAddress: { type: DataTypes.STRING },
    officialEmail: { type: DataTypes.STRING },
    phoneNumber: { type: DataTypes.STRING },
    mobile: { type: DataTypes.STRING },
    fax: { type: DataTypes.STRING },
    // social media
    facebookLink: { type: DataTypes.STRING },
    twitterLink: { type: DataTypes.STRING },
    instagramLink: { type: DataTypes.STRING },
    pinterestLink: { type: DataTypes.STRING },
    YoutubeLink: { type: DataTypes.STRING },
    // seo
    metakeywords_ar: { type: DataTypes.TEXT },
    metakeywords_en: { type: DataTypes.TEXT },
    metaDescription_ar: { type: DataTypes.TEXT },
    metaDescription_en: { type: DataTypes.TEXT },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    ifream: { type: DataTypes.TEXT },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  { charset: "utf8", collate: "utf8_general_ci" }
);
tbl_app_settings.sync();
export default tbl_app_settings;

import { DataTypes, Op, Sequelize } from "sequelize";
import { env } from "../config/config";
const sequelize = new Sequelize(...env.database);
const tbl_categorys = sequelize.define(
  "tbl_categorys",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },

    category_ar: {
      type: DataTypes.STRING,
    },
    category_en: {
      type: DataTypes.STRING,
    },
    description_ar: {
      type: DataTypes.TEXT,
    },
    description_en: {
      type: DataTypes.TEXT,
    },
    slug_ar: {
      type: DataTypes.STRING,
    },
    slug_en: {
      type: DataTypes.STRING,
    },
    metaDescription_ar: {
      type: DataTypes.TEXT,
    },
    metaDescription_en: {
      type: DataTypes.TEXT,
    },
    metaKeywords_ar: {
      type: DataTypes.TEXT,
    },
    metaKeywords_en: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
    },

    mainCatigory: {
      type: DataTypes.INTEGER,
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
      mainCategorys: {
        where: {
          mainCatigory: 0,
        },
      },
      supCategorys: {
        where: {
          mainCatigory: { [Op.ne]: 0 },
        },
      },
    },
  }
);
tbl_categorys.sync();
tbl_categorys.hasMany(tbl_categorys, {
  as: "allSupCategorys",
  foreignKey: "mainCatigory",
});
tbl_categorys.belongsTo(tbl_categorys, {
  as: "mainCatigorys",
  foreignKey: "mainCatigory",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default tbl_categorys;

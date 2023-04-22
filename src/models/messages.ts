import { DataTypes, Sequelize } from "sequelize";
import { env } from "../config/config";
import tbl_users from "./users";
const sequelize = new Sequelize(...env.database);
const tbl_messages = sequelize.define(
  "tbl_messages",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.STRING, allowNull: false },
    isSeen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
    scopes: {
      isSeen: {
        where: {
          isSeen: true,
        },
      },
      notSeen: {
        where: {
          isSeen: false,
        },
      },
    },
  }
);
tbl_messages.sync();
tbl_messages.belongsTo(tbl_users, {
  as: "messageUser",
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
export default tbl_messages;

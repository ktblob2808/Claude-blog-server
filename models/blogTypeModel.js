const { DataTypes } = require("sequelize");
const sequelize = require('../utils/dbConnect');

// Define BlogType model
const BlogType = sequelize.define(
  "blogtype",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    articleCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = BlogType;

const { DataTypes } = require("sequelize");
const sequelize = require('../utils/dbConnect');
const Blog = require('./blogModel');

// Define Message model
const Message = sequelize.define(
  "message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createDate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Blog,
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

// Define relationship
Message.belongsTo(Blog, { foreignKey: 'blogId' });
Blog.hasMany(Message, { foreignKey: 'blogId' });

module.exports = Message;

const { DataTypes } = require('sequelize');
const sequelize = require('../utils/dbConnect');
const md5 = require('md5');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  loginId: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  loginPwd: {
    type: DataTypes.STRING(45),
    allowNull: false,
    set(value) {
      // Encrypt password with md5 before saving
      this.setDataValue('loginPwd', md5(value));
    }
  }
}, {
  tableName: 'admin',
  timestamps: false
});

module.exports = Admin;

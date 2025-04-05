const sequelize = require('./dbConnect');
const Admin = require('../models/adminModel');
const { Banner } = require('../models/bannerModel');
const md5 = require('md5');

// Import other models here
// const OtherModel = require('../models/otherModel');

async function syncDatabase() {
  try {
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');

    // Check if admin table is empty
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      // Create initial admin user
      await Admin.create({
        loginId: 'admin',
        name: 'Administrator',
        loginPwd: 'admin123' // Will be encrypted via the setter
      });
      console.log('Initial admin user created');
    }
  } catch (error) {
    console.error('Database synchronization failed:', error);
  }
}

module.exports = {
  syncDatabase
};

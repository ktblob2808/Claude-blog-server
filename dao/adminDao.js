const Admin = require('../models/adminModel');
const md5 = require('md5');

class AdminDao {
  /**
   * Find admin by loginId and password
   * @param {string} loginId - Admin login ID
   * @param {string} loginPwd - Admin password (will be encrypted)
   * @returns {Promise<Admin|null>} - Admin record or null if not found
   */
  async findAdmin(loginId, loginPwd) {
    try {
      const admin = await Admin.findOne({
        where: {
          loginId,
          loginPwd: md5(loginPwd)
        }
      });
      return admin;
    } catch (error) {
      console.error('Error finding admin:', error);
      return null;
    }
  }

  async updateAdminDao(newAccountInfo){
    return await Admin.update(newAccountInfo, {
        where : {
            loginId : newAccountInfo.loginId
        }
    })
}
}

module.exports = new AdminDao();

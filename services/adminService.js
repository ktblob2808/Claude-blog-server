const adminDao = require('../dao/adminDao');
const { ValidationError, UnknownError } = require('../errors');

class AdminService {
  /**
   * Admin login service
   * @param {string} loginId - Admin login ID
   * @param {string} loginPwd - Admin password
   * @returns {Promise<Object>} - Login result with admin data
   * @throws {ValidationError} - If login fails
   */
  async login(loginId, loginPwd) {
    if (!loginId || !loginPwd) {
      throw new ValidationError('Login ID and password are required');
    }

    try {
      const admin = await adminDao.findAdmin(loginId, loginPwd);
      
      if (!admin) {
        throw new ValidationError('Invalid login credentials');
      }

      // Return admin data without password
      const adminData  = admin.get({ plain: true });
      return {
        //success: true,
        data: adminData
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new UnknownError('Login failed', 500);
    }
  }
}

module.exports = new AdminService();

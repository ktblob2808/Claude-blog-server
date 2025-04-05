const adminDao = require('../dao/adminDao');
const { ValidationError, UnknownError } = require('../errors');
const jwt = require('jsonwebtoken');

class AdminService {
  /**
   * Admin login service
   * @param {string} loginId - Admin login ID
   * @param {string} loginPwd - Admin password
   * @param {number|null} remember - Days to remember login (optional)
   * @returns {Promise<Object>} - Login result with admin data and token
   * @throws {ValidationError} - If login fails
   */
  async login(loginId, loginPwd, remember) {
    if (!loginId || !loginPwd) {
      throw new ValidationError('Login ID and password are required');
    }

    try {
      const admin = await adminDao.findAdmin(loginId, loginPwd);
      
      if (!admin) {
        throw new ValidationError('Invalid login credentials');
      }

      // Return admin data without password
      const { loginPwd: _, ...adminData } = admin.get({ plain: true });
      
      // Generate JWT token
      const expiresIn = remember ? `${remember}d` : '1d';
      const tokenPayload = {
        id: adminData.id,
        loginId: adminData.loginId,
        name: adminData.name
      };
      
      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET || 'your-jwt-secret-key',
        { expiresIn }
      );

      return {
        token,
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

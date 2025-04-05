const { Banner } = require('../models/bannerModel');

class BannerDao {
  /**
   * Get all banner items
   * @returns {Promise<Array>} - All banner records
   */
  async getAllBanners() {
    try {
      const banners = await Banner.findAll();
      return banners;
    } catch (error) {
      console.error('Error getting banners:', error);
      return [];
    }
  }

  /**
   * Replace all banners with new data
   * @param {Array} bannerData - New banner items to insert
   * @returns {Promise<Array>} - Newly created banner records
   */
  async replaceBanners(bannerData) {
    try {
      // Transaction to ensure atomicity
      const result = await Banner.sequelize.transaction(async (t) => {
        // Delete all existing records
        await Banner.destroy({ truncate: true, transaction: t });
        
        // Insert new records
        const newBanners = await Banner.bulkCreate(bannerData, { transaction: t });
        return newBanners;
      });
      
      return result;
    } catch (error) {
      console.error('Error replacing banners:', error);
      throw error;
    }
  }
}

module.exports = new BannerDao();

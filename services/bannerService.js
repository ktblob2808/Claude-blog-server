const bannerDao = require('../dao/bannerDao');
const { ValidationError, UnknownError } = require('../errors');

class BannerService {
  /**
   * Get all banner items
   * @returns {Promise<Array>} - All banner records
   */
  async getAllBanners() {
    try {
      const banners = await bannerDao.getAllBanners();
      return banners;
    } catch (error) {
      throw new UnknownError('Error retrieving banners', 500);
    }
  }

  /**
   * Replace all banners with new data
   * @param {Array} bannerData - New banner items to insert
   * @returns {Promise<Array>} - Newly created banner records
   */
  async replaceBanners(bannerData) {
    try {
      // Validate input data
      if (!Array.isArray(bannerData) || bannerData.length === 0) {
        throw new ValidationError('Invalid banner data format');
      }
      
      // Validate each banner object
      for (const banner of bannerData) {
        if (!banner.midImg || !banner.bigImg || !banner.title || !banner.description) {
          throw new ValidationError('Each banner must have midImg, bigImg, title, and description');
        }
      }
      
      const result = await bannerDao.replaceBanners(bannerData);
      return result;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new UnknownError('Error updating banners', 500);
    }
  }
}

module.exports = new BannerService();

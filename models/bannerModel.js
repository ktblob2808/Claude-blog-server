const { DataTypes } = require('sequelize');
const sequelize = require('../utils/dbConnect');

const Banner = sequelize.define('Banner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  midImg: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  bigImg: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'banner',
  timestamps: false
});

// Initial data seeding function
async function seedBannerData() {
  const count = await Banner.count();
  if (count === 0) {
    await Banner.bulkCreate([
      {
        midImg: '/static/images/banner1_mid.jpg',
        bigImg: '/static/images/banner1_big.jpg',
        title: 'Welcome to Claude Blog',
        description: 'A modern blogging platform for AI enthusiasts'
      },
      {
        midImg: '/static/images/banner2_mid.jpg',
        bigImg: '/static/images/banner2_big.jpg',
        title: 'Share Your Ideas',
        description: 'Connect with a community of like-minded developers'
      },
      {
        midImg: '/static/images/banner3_mid.jpg',
        bigImg: '/static/images/banner3_big.jpg',
        title: 'Explore AI Technologies',
        description: 'Discover the latest in artificial intelligence'
      }
    ]);
    console.log('Banner seed data created');
  }
}

// Export both the model and the seed function
module.exports = {
  Banner,
  seedBannerData
};

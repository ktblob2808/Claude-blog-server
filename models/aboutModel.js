const { DataTypes } = require("sequelize");
const sequelize = require('../utils/dbConnect');

// Define About model
const About = sequelize.define(
  "about",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

// Seed function to initialize about data
exports.seedAboutData = async function() {
  const count = await About.count();
  if (count === 0) {
    // Initialize with default data if no records exist
    await About.create({
      url: "https://example.com/about"
    });
    console.log("About data seeded successfully");
  }
};

module.exports = About;

const sequelize = require('./dbConnect');
const Admin = require('../models/adminModel');
const BlogType = require('../models/blogTypeModel');
const { Banner } = require('../models/bannerModel');
const md5 = require('md5');
const Demo = require("../models/demoModel");

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

    const blogTypeCount = await BlogType.count();
    if (blogTypeCount === 0) {
      await BlogType.bulkCreate([
        { name: "Front-end", articleCount: 0, order: 1 },
        { name: "Back-end", articleCount: 0, order: 2 },
        { name: "Database", articleCount: 0, order: 3 },
        { name: "DevOps", articleCount: 0, order: 4 },
        { name: "Mobile", articleCount: 0, order: 5 },
      ]);
      console.log("Blog Type data initialized!");
    }

    // Add seed for demo data
    await seedDemoData().catch(err => console.error('Error seeding demo data:', err));

  } catch (error) {
    console.error('Database synchronization failed:', error);
  }
}

// Function to seed demo data
async function seedDemoData() {
  const count = await Demo.count();
  if (count === 0) {
    const demoData = [
      {
        name: "Personal Blog",
        url: "https://blog.example.com",
        github: "https://github.com/example/blog",
        description: JSON.stringify(["vue", "nodejs", "html", "css"]),
        thumb: "https://via.placeholder.com/300x200",
        order: 1
      },
      {
        name: "Task Manager",
        url: "https://tasks.example.com",
        github: "https://github.com/example/task-manager",
        description: JSON.stringify(["react", "nodejs", "mongodb"]),
        thumb: "https://via.placeholder.com/300x200",
        order: 2
      },
      {
        name: "E-commerce Platform",
        url: "https://shop.example.com",
        github: "https://github.com/example/ecommerce",
        description: JSON.stringify(["vue", "express", "mysql", "redis"]),
        thumb: "https://via.placeholder.com/300x200",
        order: 3
      }
    ];
    
    await Demo.bulkCreate(demoData);
    console.log("Demo data seeded successfully");
  }
}

module.exports = {
  syncDatabase,
  seedDemoData
};

const { DataTypes } = require("sequelize");
const sequelize = require('../utils/dbConnect');

// Define Setting model
const Setting = sequelize.define(
  "setting",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false
    },
    siteTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    github: {
      type: DataTypes.STRING,
      allowNull: false
    },
    qq: {
      type: DataTypes.STRING,
      allowNull: false
    },
    qqQrCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    weixin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    weixinQrCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    icp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    githubName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    favicon: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

// Function to seed initial setting data
const seedSettingData = async () => {
  const count = await Setting.count();
  if (count === 0) {
    await Setting.create({
      avatar: "/images/avatar.jpg",
      siteTitle: "My Personal Blog",
      github: "https://github.com",
      qq: "123456789",
      qqQrCode: "/images/qq.png",
      weixin: "myweixin",
      weixinQrCode: "/images/weixin.png",
      mail: "admin@example.com",
      icp: "ICP备123456号",
      githubName: "developer",
      favicon: "/images/favicon.ico"
    });
    console.log('Initial setting data has been seeded');
  }
};

module.exports = {
  Setting,
  seedSettingData
};

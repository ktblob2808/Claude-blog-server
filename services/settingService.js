const settingDao = require("../dao/settingDao");

// Get the site settings
exports.getSetting = async function () {
  const setting = await settingDao.getSetting();
  if (!setting) {
    throw new Error("Settings not found");
  }
  
  return setting;
};

// Update the site settings
exports.updateSetting = async function (settingInfo) {
  // Validate the update data if needed
  // We allow partial updates, so no need to validate all fields
  
  return await settingDao.updateSetting(settingInfo);
};

const { Setting } = require("../models/settingModel");

// Get the site settings
exports.getSetting = async function () {
  const result = await Setting.findOne();
  return result ? result.toJSON() : null;
};

// Update the site settings
exports.updateSetting = async function (settingInfo) {
  const setting = await Setting.findOne();
  
  if (!setting) {
    // If no setting exists, create one
    const newSetting = await Setting.create(settingInfo);
    return newSetting.toJSON();
  }
  
  // Update the existing setting
  await Setting.update(settingInfo, {
    where: {
      id: setting.id
    }
  });
  
  // Get and return the updated setting
  const updatedSetting = await Setting.findByPk(setting.id);
  return updatedSetting ? updatedSetting.toJSON() : null;
};

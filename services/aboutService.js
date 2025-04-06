const aboutDao = require("../dao/aboutDao");

// Get the about information
exports.getAbout = async function () {
  const about = await aboutDao.getAbout();
  if (!about) {
    throw new Error("About information not found");
  }
  
  return about;
};

// Update the about information
exports.updateAbout = async function (aboutInfo) {
  // Validate about information
  if (!aboutInfo.url) {
    throw new Error("URL is required");
  }
  
  return await aboutDao.updateAbout(aboutInfo);
};

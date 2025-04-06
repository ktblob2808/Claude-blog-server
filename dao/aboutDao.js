const { About } = require("../models/aboutModel");

// Get the about information (there should be only one record)
exports.getAbout = async function () {
  const result = await About.findOne();
  if (result) {
    return result.toJSON();
  }
  return null;
};

// Update the about information
exports.updateAbout = async function (aboutInfo) {
  const about = await About.findOne();
  
  if (about) {
    // Update existing record
    await About.update(aboutInfo, {
      where: {
        id: about.id
      }
    });
    
    // Return the updated record
    const updatedAbout = await About.findOne();
    return updatedAbout.toJSON();
  } else {
    // Create if not exists (although the seed should handle this)
    const result = await About.create(aboutInfo);
    return result.toJSON();
  }
};

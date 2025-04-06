const demoDao = require("../dao/demoDao");

// Add a new demo project
exports.addDemo = async function (newDemo) {
  // Validate demo data
  if (!newDemo.name || !newDemo.url || !newDemo.github || 
      !newDemo.description || !newDemo.thumb || !newDemo.order) {
    throw new Error("All fields are required (name, url, github, description, thumb, order)");
  }
  
  // Special handling for description - convert array to string
  if (Array.isArray(newDemo.description)) {
    newDemo.description = JSON.stringify(newDemo.description);
  }
  
  return await demoDao.addDemo(newDemo);
};

// Get a demo project by ID
exports.getDemoById = async function (id) {
  if (!id) {
    throw new Error("Demo project ID is required");
  }
  
  const demo = await demoDao.getDemoById(id);
  if (!demo) {
    throw new Error("Demo project not found");
  }
  
  // Special handling for description - convert string to array
  if (demo.description) {
    try {
      demo.description = JSON.parse(demo.description);
    } catch (error) {
      console.error("Error parsing description:", error);
    }
  }
  
  return demo;
};

// Get all demo projects
exports.getAllDemos = async function () {
  const demos = await demoDao.getAllDemos();
  
  // Special handling for description - convert string to array for each demo
  return demos.map(demo => {
    if (demo.description) {
      try {
        demo.description = JSON.parse(demo.description);
      } catch (error) {
        console.error("Error parsing description:", error);
      }
    }
    return demo;
  });
};

// Update a demo project by ID
exports.updateDemo = async function (id, demoInfo) {
  if (!id) {
    throw new Error("Demo project ID is required");
  }
  
  // Check if demo project exists
  const exists = await demoDao.getDemoById(id);
  if (!exists) {
    throw new Error("Demo project not found");
  }
  
  // Special handling for description - convert array to string
  if (demoInfo.description && Array.isArray(demoInfo.description)) {
    demoInfo.description = JSON.stringify(demoInfo.description);
  }
  
  const updated = await demoDao.updateDemo(id, demoInfo);
  
  // Convert description back to array for response
  if (updated && updated.description) {
    try {
      updated.description = JSON.parse(updated.description);
    } catch (error) {
      console.error("Error parsing description:", error);
    }
  }
  
  return updated;
};

// Delete a demo project by ID
exports.deleteDemo = async function (id) {
  if (!id) {
    throw new Error("Demo project ID is required");
  }
  
  // Check if demo project exists
  const exists = await demoDao.getDemoById(id);
  if (!exists) {
    throw new Error("Demo project not found");
  }
  
  return await demoDao.deleteDemo(id);
};

const Demo = require("../models/demoModel");

// Add a new demo project
exports.addDemo = async function (demoInfo) {
  const result = await Demo.create(demoInfo);
  return result.toJSON();
};

// Get a demo project by ID
exports.getDemoById = async function (id) {
  const result = await Demo.findByPk(id);
  if (result) {
    return result.toJSON();
  }
  return null;
};

// Get all demo projects sorted by order
exports.getAllDemos = async function () {
  const result = await Demo.findAll({
    order: [["order", "ASC"]]
  });
  return result.map(item => item.toJSON());
};

// Update a demo project by ID
exports.updateDemo = async function (id, demoInfo) {
  await Demo.update(demoInfo, {
    where: {
      id
    }
  });
  const updatedDemo = await Demo.findByPk(id);
  return updatedDemo ? updatedDemo.toJSON() : null;
};

// Delete a demo project by ID
exports.deleteDemo = async function (id) {
  const demo = await Demo.findByPk(id);
  if (demo) {
    await demo.destroy();
    return true;
  }
  return null;
};

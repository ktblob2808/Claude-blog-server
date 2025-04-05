const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const BlogType = sequelize.define("BlogType", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  articleCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  order: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

async function addBlogTypeData() {
  const count = await BlogType.count();
  if (count === 0) {
    await BlogType.bulkCreate([
      { name: "Front-end", articleCount: 0, order: 1 },
      { name: "Back-end", articleCount: 0, order: 2 },
      { name: "Database", articleCount: 0, order: 3 },
      { name: "DevOps", articleCount: 0, order: 4 },
      { name: "Mobile", articleCount: 0, order: 5 },
    ]);
    console.log("Blog Type data initialized!");
  }
}

module.exports = async function () {
  await sequelize.sync();
  await addBlogTypeData();
};
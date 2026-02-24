const { Sequelize } = require('sequelize');
require("dotenv").config();

const seqConnection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false
  }
);

async function makeConnection() {
  await seqConnection
    .authenticate()
    .then(() => console.log(`DB connected...`))
    .catch((e) => console.log(`DB not connected ${e}...`));
}

makeConnection();

module.exports = seqConnection;

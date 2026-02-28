const { Sequelize } = require("sequelize");
require("dotenv").config();

const seqConnection = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false, 
    },
  },
});

async function makeConnection() {
  await seqConnection
    .authenticate()
    .then(() => console.log(`DB connected...`))
    .catch((e) => console.log(`DB not connected ${e}...`));
}

makeConnection();

module.exports = seqConnection;
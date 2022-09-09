const { Sequelize } = require('sequelize');
const logger = require('../controllers/LoggerController');
const { loggerStatus, OPERATIONS } = require('../config/LoggerObject');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQL_DB_NAME,
  process.env.MYSQL_DB_USERNAME,
  process.env.MYSQL_DB_PASSWORD,
  {
    host: process.env.MYSQL_DB_HOSTNAME,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

sequelize.sync();
(async () => {
  try {
    await sequelize.authenticate();
    console.log(`${process.env.HOST_TYPE} - connected.....!!`);
    logger.logActivity(loggerStatus.INFO, null, `${process.env.HOST_TYPE} - Connection has been established successfully.`, null, OPERATIONS.DATABASE.CONNECT);
  } catch (error) {
    logger.logActivity(loggerStatus.ERROR, null, 'Unable to connect to the database', error, OPERATIONS.DATABASE.CONNECT);
    console.log(`${process.env.HOST_TYPE} - not connected.!!`);
  }
})();

module.exports = sequelize;
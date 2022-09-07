const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const User = sequelize.define("Users", {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  
  module.exports = User;
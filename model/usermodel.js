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
    phoneNo: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: { len: [0,10] }
    },
    photoIdUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    access: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  
  module.exports = User;
const {db} = require('../db');
const { Sequelize, DataTypes } = require('sequelize');

const User = db.define('user', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING
});

module.exports = {User};
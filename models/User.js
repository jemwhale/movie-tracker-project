const {db} = require('../db');
const { Sequelize, DataTypes} = require('sequelize');

const User = db.define('user', {
  name: {type: DataTypes.STRING,
      allowNull: false
  },
  email: DataTypes.STRING,
});

module.exports = {User};
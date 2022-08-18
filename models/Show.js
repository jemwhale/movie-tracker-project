const {db} = require('../db');
const { Sequelize, DataTypes} = require('sequelize');

const Show = db.define('show', {
  title: DataTypes.STRING,
  genre: DataTypes.STRING,
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = {Show};
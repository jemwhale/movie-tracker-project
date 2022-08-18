const {db} = require('../db');
const { Sequelize, DataTypes} = require('sequelize');

const Show = db.define('show', {
  title: DataTypes.STRING,
  genre: DataTypes.ARRAY(DataTypes.DECIMAL),
  // status: {
  //   type: DataTypes.BOOLEAN,
  //   defaultValue: false
  // }
});

module.exports = {Show};
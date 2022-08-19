const {db} = require('../db');
const { Sequelize, DataTypes} = require('sequelize');

const Show = db.define('show', {
  title: {
    type: DataTypes.STRING
  },
  genre: DataTypes.ARRAY(DataTypes.DECIMAL),
});

module.exports = {Show};
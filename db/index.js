const path = require('path');
const { Sequelize, Model, DataTypes } = require('sequelize');

const db = new Sequelize({
    dialect: 'sqlite',
    storage: './db/data.sqlite'
})

module.exports = {
    db,
    Sequelize
};
const {User} = require('./User')
const {Show} = require('./Show')
const {WatchedList} = require('./Watched-list')
const { Sequelize, Op } = require('sequelize');

User.belongsToMany(Show, {through: 'watched-list'});
Show.belongsToMany(User, {through: 'watched-list'});

module.exports = {
    User,
    Show,
    WatchedList,
    Sequelize,
    Op
};
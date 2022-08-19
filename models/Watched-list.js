const {db} = require('../db');
const { Sequelize, DataTypes } = require('sequelize');

const WatchedList = db.define('watched-list', {
    rating: {  
        type: DataTypes.NUMBER,
        validate: {
            checkLength(val){
                if (val < 0 || val > 10) throw new Error('Rating needs to be out of 10!')
            }
        }
    }
});

module.exports = {WatchedList};
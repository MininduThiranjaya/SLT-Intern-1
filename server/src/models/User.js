const {DataTypes} = require('sequelize')
const seqConnection = require('../db/dbConnection')

const User = seqConnection.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userName: {type:DataTypes.STRING(100), allowNull: false},
    phoneNumber: {type:DataTypes.INTEGER(10), allowNull: false},
    email: {type:DataTypes.STRING(100), allowNull: false, unique: true},
    password: {type:DataTypes.STRING(255), allowNull: false},
}, {timestamps: true})

module.exports = User

// the user cannot be the both client and conductor if he use same email
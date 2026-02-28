const {DataTypes} = require('sequelize')
const seqConnection = require('../db/dbConnection')

const ForgetPassword = seqConnection.define('ForgetPassword', {
    email: {type: DataTypes.STRING(100), allowNull: false},
    token: {type: DataTypes.STRING(255), allowNull: false},
    expiresAt: {type: DataTypes.DATE},
    isAvailable: {type: DataTypes.BOOLEAN, defaultValue: false}
})

module.exports = ForgetPassword
const { DataTypes } = require('sequelize')
const seqConnection = require('../db/dbConnection')

const Role = seqConnection.define('Role', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
})

module.exports = Role
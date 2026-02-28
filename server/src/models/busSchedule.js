const {DataTypes} = require('sequelize')
const seqConnection = require('../db/dbConnection')

const BusSchedule = seqConnection.define("BusSchedule", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    busId: { type: DataTypes.INTEGER, allowNull: false, onDelete: "CASCADE" },
    scheduleDate: { type: DataTypes.DATEONLY, allowNull: false }
}, { timestamps: true });

module.exports = BusSchedule
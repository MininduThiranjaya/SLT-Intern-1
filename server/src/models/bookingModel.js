const {DataTypes} = require('sequelize')
const seqConnection = require('../db/dbConnection')

const Booking = seqConnection.define("Booking", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, onDelete: "CASCADE" },
    scheduleId: { type: DataTypes.INTEGER, allowNull: false, onDelete: "CASCADE" },
    totalPrice: { type: DataTypes.DECIMAL(10,2), allowNull: false},
    status: { type: DataTypes.ENUM("PENDING","CONFIRMED","CANCELLED"), defaultValue: "PENDING"}
}, { timestamps: true });

module.exports = Booking
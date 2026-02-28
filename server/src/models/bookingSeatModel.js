const {DataTypes} = require('sequelize')
const seqConnection = require('../db/dbConnection')

const BookingSeat = seqConnection.define("BookingSeat", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bookingId: { type: DataTypes.INTEGER, allowNull: false, onDelete: "CASCADE" },
    seatNumber: { type: DataTypes.STRING, allowNull: false}
}, { timestamps: false });

module.exports = BookingSeat
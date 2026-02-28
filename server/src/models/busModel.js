const {DataTypes} = require('sequelize')
const seqConnection = require('../db/dbConnection')

const Bus = seqConnection.define("Bus", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    busNumber: { type: DataTypes.STRING(20), allowNull: false, unique: true},
    from: { type: DataTypes.STRING(100), allowNull: false },
    to: { type: DataTypes.STRING(100), allowNull: false },
    departure: { type: DataTypes.TIME, allowNull: false },
    arrival: { type: DataTypes.TIME, allowNull: false },
    numberOfSeats: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    isAvailable: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true });

module.exports = Bus
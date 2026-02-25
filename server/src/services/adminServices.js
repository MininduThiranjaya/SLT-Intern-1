const {Bus,BusSchedule} = require('../models/index')

async function createSchedule(req) {
    try{
        const {busNumber, date} = req.body
        if(!busNumber || !date) return { statusCode: 401, status: false, message: "All fields are required", data: null }
        const tempBus = await Bus.findOne({
            where: { busNumber }
        });
        if(!tempBus) return { statusCode: 404, status: false, message: "Bus not found", data: null }
        const existingSchedule = await BusSchedule.findOne({
        where: {
            busId: tempBus.id,
            scheduleDate: date
        }
        });
        if(existingSchedule) return { statusCode: 409, status: false, message: "Schedule already exists for this bus on this day", data: null}
        const newSchedule = await BusSchedule.create({
            busId: tempBus.id,
            scheduleDate: date
        });
        const {id: _id, busId: _bus, ...scheduleDate} = newSchedule.toJSON()
        return {statusCode: 201, status: true, message: "Schedule created successfully", data: scheduleDate}
    }
    catch(e) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

async function addBus(req) {
    try {
        const { busNumber, from, to, departure, arrival, numberOfSeats, price, isAvailable } = req.body;
        if (!busNumber || !from || !to || !departure || !arrival || !numberOfSeats || !price || !isAvailable) return { statusCode: 401, status: false, message: "All fields are required", data: null }
        const newBus = await Bus.create({
            busNumber,
            from,
            to,
            departure,
            arrival,
            numberOfSeats,
            price: parseFloat(price),
            isAvailable
        });
        const {id: _id, ...userData} = newBus.toJSON()
        return {statusCode: 200, status: true, message: "Bus Registration successfull", data:userData }
    } catch (error) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

async function deleteBus(req) {
    try {
        const { busNumber } = req.body;
        if (!busNumber) return { statusCode: 401, status: false, message: "All fields are required", data: null }
        const isDeleted = await Bus.destroy({
            where: {
                busNumber: busNumber
            }
        });
        if(isDeleted === 0) return {statusCode: 404, status: true, message: "Bus not found for deletion", data:null }
        return {statusCode: 200, status: true, message: "Bus deleted successfull", data:isDeleted }
    } catch (error) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

async function deleteSchedule(req) {
    try {
        const { id } = req.body;
        if (!id) return { statusCode: 401, status: false, message: "All fields are required", data: null }
        const isDeleted = await BusSchedule.destroy({
            where: {
                id: id
            }
        });
        if(isDeleted === 0) return {statusCode: 404, status: true, message: "Bus schedule not found for deletion", data:null }
        return {statusCode: 200, status: true, message: "Bus schedule deleted successfull", data:isDeleted }
    } catch (error) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

module.exports = {createSchedule, addBus, deleteBus, deleteSchedule}
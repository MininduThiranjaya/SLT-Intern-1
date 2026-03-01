const {Bus, BusSchedule, User, Role, Booking, BookingSeat} = require('../models/index')
const { Op, fn, col } = require("sequelize");

// create schedule
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

// add bus
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

// delete bus
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

// delete schedule
async function deleteSchedule(req) {
    try {
        const { id } = req.body;
        if(!id) return { statusCode: 401, status: false, message: "All fields are required", data: null }
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

// get all users
async function getUsers() {
    try {
        const tempUsers = await User.findAll({
            attributes: {
                exclude: ['id', 'password', 'updatedAt'],
                include: [
                    [fn('COUNT', col('Bookings->BookingSeats.id')), 'totalSeatsBooked']
                ]
            },
            include: [
                {
                    model: Booking,
                    attributes: [],
                    where: {
                        status: ["PENDING","CONFIRMED"]
                    },
                    required: false, // include users even if no bookings
                    include: [
                        {
                            model: BookingSeat,
                            attributes: [],
                            required: false
                        }
                    ]
                },
                {
                    model: Role,
                    where: { name: 'passenger' },
                    attributes: [] // we don’t need role fields
                }
            ],
            group: ['User.id'], // required because of COUNT aggregate  
        });
        if(tempUsers.length == 0) return {statusCode: 200, status: true, message: "No user found", data:null }
        return {statusCode: 200, status: true, message: "Fetach all users", data: tempUsers }
    } catch (e) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

// get all bookings
async function getAllBookings() {
    try {
        const tempAllBookings = await Booking.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'userName', 'email', 'phoneNumber'] 
                },
                {
                    model:BusSchedule,
                    include: [
                        {
                            model:Bus,
                            attributes: ["busNumber", "from", "to", "departure", "arrival", 'price']
                        }
                    ]
                },
                {
                    model: BookingSeat,
                    attributes: ['seatNumber']
                }
            ],
            order: [['createdAt', 'DESC']]
        })
        if(tempAllBookings.length == 0) return {statusCode: 200, status: true, message: "No user booking found", data:null }
        return {statusCode: 200, status: true, message: "Fetach all user bookings", data: tempAllBookings }
    } catch (e) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

// update booking status
async function updateBookingStatus(res) {
    try {
        const {bookingId, status} = res.body
        if(!bookingId || !status) return { statusCode: 401, status: false, message: "All fields are required", data: null }
        const allowedStatus = ["PENDING", "CONFIRMED", "CANCELLED"];   
        if (!allowedStatus.includes(status)) return {statusCode: 401, status: false, message: "Invalid booking status", data: null}
        const booking = await Booking.findByPk(bookingId);
        if(!booking) return { statusCode: 404, status: false, message: "No booking found", data: null }
        booking.status = status;
        await booking.save();
        return {statusCode: 200, status: true, message: "Booking status updated", data: null }
    } catch (e) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

// update bus
async function updateBus(res) {
    try {
        const {busNumber, ...fieldsToUpdate} = res.body
        if(!busNumber) return { statusCode: 401, status: false, message: "All fields are required", data: null }
        const [updated] = await Bus.update(fieldsToUpdate, {
            where: { busNumber },
        });
        if(!updated) return {statusCode: 404, status: true, message: "Bus not found for updating", data: null }
        return {statusCode: 200, status: true, message: "Bus updated successfully", data: null }
    } catch (e) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

// get all stats
async function getStats() {
    try {
        const now = new Date();
        const [
            totalBuses,
            totalUsers,
            totalBookings,
            confirmedBookings,
            pendingBookings,
            rejectedBookings,
            activeSchedules
        ] = await Promise.all([

            Bus.count(),
            User.count({
                distinct: true,
                col: "id",
                include:[{
                model: Role,
                where: {
                    name: "passenger"
                }
            }]}),
            Booking.count(),
            Booking.count({ where: { status: "CONFIRMED" } }),
            Booking.count({ where: { status: "PENDING" } }),
            Booking.count({ where: { status: "CANCELLED" } }),
            BusSchedule.count({
                where: {
                    scheduleDate : {
                        [Op.gte]: now
                    }
                }
            })
        ]);
        return {statusCode: 200, status: true, message: "All stats", data: {
            totalBuses,
            activeSchedules,
            totalBookings,
            totalUsers,
            confirmedBookings,
            pendingBookings,
            rejectedBookings
        }
    }
    } catch (e) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

module.exports = {createSchedule, addBus, deleteBus, deleteSchedule, getUsers, getAllBookings, updateBookingStatus, updateBus, getStats}
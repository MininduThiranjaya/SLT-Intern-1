const {Bus, BusSchedule, User, BookingSeat, Booking} = require('../models/index')
const seqConnection = require('../db/dbConnection')

async function searchSchedule(req) {
    try {
        const {fromCity,  toCity, travelDate} = req.body
        if(!fromCity || !toCity || !travelDate) return { statusCode: 401, status: false, message: "All fields are required", data: null }
        const busWithSchedules = await Bus.findAll({
            attributes: {
                exclude: ['updatedAt', 'createdAt']
            },
            where: {
                from: fromCity,
                to: toCity
            },
            include: {
                model: BusSchedule,
                attributes: {
                    exclude: ['busId', 'updatedAt', 'createdAt']
                },
                where: {
                    scheduleDate: travelDate
                }
            }
        })
        if(!busWithSchedules) return {statusCode: 200, status: true, message: "No bus schedule found on that day", data: null}
        return {statusCode: 200, status: true, message: "Bus schedule found", data: busWithSchedules}
    }
    catch(e) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

async function busSeatBooking(req) {
    try {
        const {busNumber, scheduleId, seats} = req.body
        const {email} = req.user
        console.log(email, busNumber, scheduleId, seats)
        if(!scheduleId || !seats || !email || !busNumber) return { statusCode: 401, status: false, message: "All fields are required", data: null }
        const t = await seqConnection.transaction();
        const tempUser = await User.findOne({
            where: {
                email:email
            }
        })
        if(!tempUser) return { statusCode: 404, status: false, message: "User not found", data: null }
        const alreadyBooked = await BookingSeat.findAll({
            where: {
                seatNumber: seats, 
            },
            include: {
                model: Booking,
                where: { scheduleId }
            },
            transaction: t
        });

        if (alreadyBooked.length > 0) {
            const bookedSeats = alreadyBooked.map((b) => b.seatNumber);
            await t.rollback(); 
            return { statusCode:401, status: false, message: `The following seats are already booked: ${bookedSeats.join(", ")}`, data: bookedSeats}
        }
        const tempSchedule = await BusSchedule.findByPk(scheduleId, {
            include: [{ model: Bus, attributes: ["price"] }],
            transaction: t,
        });
        if(!tempSchedule) return { statusCode: 404, status: false, message: "Bus schedule not found", data: null }
        const totalPrice = tempSchedule.Bus.price * seats.length;
        const booking = await Booking.create(
            { userId:tempUser.id, scheduleId, totalPrice },
            { transaction: t }
        );
        const bookingSeatsData = seats.map((seatNumber) => ({
            bookingId: booking.id,
            seatNumber,
        }));
        await BookingSeat.bulkCreate(bookingSeatsData, { transaction: t });
        await t.commit();
        return {statusCode: 200, status: true, message: "Booking created successfully", data: {bookingId: booking.id, seats, totalPrice}}
    }
    catch(e) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

module.exports = {searchSchedule, busSeatBooking}
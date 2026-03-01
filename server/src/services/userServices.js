const {Bus, BusSchedule, User, BookingSeat, Booking} = require('../models/index')
require('dotenv')
const seqConnection = require('../db/dbConnection')
const Stripe = require('stripe')
const { where } = require('sequelize')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// search schedule
async function searchSchedule(req) {
    try {
        const {fromCity,  toCity, travelDate} = req.body
        const {email} = req.user
        const travel = new Date(travelDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (travel < today) return { statusCode: 200, status: false, message: "No bus schedule available for past dates", data: null }
        if(!fromCity || !toCity || !travelDate || !email) return { statusCode: 401, status: false, message: "All fields are required", data: null }
        const tempUser = await User.findOne({
            where: {
                email:email
            }
        })
        if(!tempUser) return {statusCode: 404, status: false, message: "User not found", data: null }
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
                    exclude: ['updatedAt', 'createdAt']
                },
                where: {
                    scheduleDate: travelDate
                },
                include: {
                    model: Booking,
                    required: false,
                    attributes: ['id', 'userId'],
                    where: {
                        status: ["PENDING","CONFIRMED"]
                    },
                    include: {
                        model: BookingSeat,
                        attributes: ['seatNumber']
                    }
                }
            }
        })
        if(!busWithSchedules) return {statusCode: 200, status: true, message: "No bus schedule found on that day", data: null}
        const formatted = busWithSchedules.map(bus => {
            bus.BusSchedules.forEach(schedule => {

                let mySeats = [];
                let otherSeats = [];

                schedule.Bookings.forEach(booking => {
                    booking.BookingSeats.forEach(seat => {

                        if (booking.userId === tempUser.id) {
                            mySeats.push(seat.seatNumber);
                        } else {
                            otherSeats.push(seat.seatNumber);
                        }

                    });
                });

                schedule.dataValues.myBookedSeats = mySeats;
                schedule.dataValues.otherBookedSeats = otherSeats;

                delete schedule.dataValues.Bookings;
            });
            return bus;
        });
        return {statusCode: 200, status: true, message: "Bus schedule found", data: formatted}
    }
    catch(e) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

// bus seat booking
async function busSeatBooking(req) {
    try {
        const {busNumber, scheduleId, seats} = req.body
        const {email} = req.user
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
        return {statusCode: 200, status: true, message: "Booking created successfully", data: {bookingId: booking.id, seats, totalPrice, busNumber}}
    }
    catch(e) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}


// delete user account
async function deleteMyAccount(req) {
    try {
        const { email } = req.user;
        if(!email) return { statusCode: 401, status: false, message: "All fields are required", data: null }
        const isDeleted = await User.destroy({
            where: {
                email: email
            }
        });
        if(isDeleted === 0) return {statusCode: 404, status: true, message: "User not found for deletion", data:null }
        return {statusCode: 200, status: true, message: "User deleted successfull", data:isDeleted }
    } catch (e) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

// get user booking
async function getMyBookings(req) {
    try {
        const{email} = req.user
        if(!email) return {statusCode: 401, status: false, message: "All fields are required", data: null}
        const tempAllBookings = await Booking.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'userName', 'email', 'phoneNumber'],
                    where: {
                        email: email
                    }
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

// create checkout session
async function createPayment(req) {
    try {
        const { bookingId, totalPrice, seats, busNumber } = req.body;

        const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [{
            price_data: {
            currency: "lkr",
            product_data: { name: `Bus ${busNumber} Seat Booking` },
            unit_amount: totalPrice * 100,
            },
            quantity: 1
        }],
        metadata: {
            bookingId,
            seats: JSON.stringify(seats)
        },
            success_url: `${process.env.FRONTEND_URL}/success?bookingId=${bookingId}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel?bookingId=${bookingId}`,
        });
        return {statusCode: 200, status: true, message: "No user booking found", data:{url: session.url} }
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, message: "Failed to create checkout session" });
    }
}

// create stripe webhook
async function webhookConnection(req) {
    try {
        const sig = req.headers["stripe-signature"];
        let event;
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        if(event.type === "checkout.session.completed") {
            const session = event.data.object;
            if (session.payment_status === "paid") {
                const bookingId = session.metadata.bookingId;
                const [updatedRows] = await Booking.update(
                    { status: "CONFIRMED", stripePaymentId: session.payment_intent},
                    { where: { id: bookingId, status: "PENDING" } }
                );
                if (updatedRows > 0) {
                    console.log(`Booking ${bookingId} confirmed`);
                } else {
                    console.log(`Booking ${bookingId} already confirmed or not found`);
                }
            }
        }
        if(event.type === "payment_intent.payment_failed") {
            const session = event.data.object;
            const bookingId = session.metadata.bookingId;
            await Booking.update(
                { status: "CANCELLED", stripePaymentId: session.payment_intent},
                { where: { id: bookingId } }
            );
        }
        if(event.type === "checkout.session.expired") {
            const session = event.data.object;
            const bookingId = session.metadata.bookingId;
            await Booking.update(
                { status: "CANCELLED", stripePaymentId: session.payment_intent},
                { where: { id: bookingId } }
            );
        }
        return {statusCode: 200, status: true, message: "Webhook success", data:{received: true}}
    } catch (e) {
        console.log(e);
        return {statusCode:500, status: false, message: "Webhook failed", data:{received: false}};
    }
}

module.exports = {searchSchedule, busSeatBooking, deleteMyAccount, getMyBookings, createPayment, webhookConnection}
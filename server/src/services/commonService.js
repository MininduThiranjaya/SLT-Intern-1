const {User, Role, ForgetPassword, Bus, BusSchedule, Booking, BookingSeat} = require('../models/index')
const { fn, col, Op  } = require("sequelize");
const {generateWebToken, verifyToken} = require("../auth/auth")
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
require('dotenv')

// user login
async function userLogin(req) {
    try {
        const {email, password} = req.body
        if(!email || !password) return {statusCode: 401, status: false, message: "Required all data...", data: null}        
        const tempUser = await User.findOne({where: {email},include: [
                { model: Role, attributes: ['name'] }
            ]})
        if(!tempUser) return {statusCode: 404, status: false, message: "User not found...", data: null}
        const userRole = tempUser.Roles.map(role => role.name)
        const isMatchPassword = await bcrypt.compare(password, tempUser.dataValues.password)
        if(!isMatchPassword) return {statusCode: 401, status: false, message: "Password not match...", data: null}
        const token = await generateWebToken(tempUser, userRole)
        const {id: _id, password: _pass, Roles: _role, ...userData} = tempUser.toJSON()
        userData.token = token
        return {statusCode: 200, status: true, message: "User loging success", data: {...userData, userRole}}
    }
    catch(e) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

// code generation
function codeGeneration() {
    return crypto.randomInt(100000, 1000000)
}

// mail instance
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

// forget password
async function forgetPassword(req) {
    try {
        const {email} = req.body
        if(!email) return {statusCode: 401, status: false, message: "Required all data...", data: null}
        const tempUser = await User.findOne({where: {email}})
        if(!tempUser) return {statusCode: 404, status: false, message: "User not found...", data: null}
        const {id: _id, password: _pass, ...userData} = tempUser.toJSON()
        const token = codeGeneration()
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        if(!token && !expiresAt) return {statusCode: 400, status: false, message: 'Error in code generation', data: null}
        await ForgetPassword.create({
            email,
            token,
            expiresAt,
            isAvailable: true
        })
        await transporter.sendMail({
            to: email,
            subject: "Password Reset",
            text: `Uses this code to reset your password and this code will be expiers withing 5 min ${token}`
        });
        return {statusCode: 200, status: true, message: "Password reset mail have been sent check mail", data: null}
    }
    catch(e) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

// forget password reset
async function forgetPasswordReset(req) {
    try {
        const {email, password, token} = req.body
        if(!email || !password || !token ) return {statusCode: 401, status: false, message: "Required all data...", data: null}
        const tempUser = await ForgetPassword.findOne({where: {email, token, isAvailable: true}})
        if(tempUser.dataValues.token !== token) return {statusCode: 401, status: false, message: "Invalied token...", data: null}
        if(tempUser.dataValues.expiresAt < new Date()) return {statusCode: 401, status: false, message: "Token expired...", data: null}
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.update(
           {password: hashedPassword},
           {where: {email: email}}
        )
        await ForgetPassword.destroy({
            where: {email: email}
        })
        return {statusCode: 200, status: true, message: "Password reset...", data: null}
    }
    catch(e) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

// user registration
async function userRegistration(req) {
    try {
        const {userName, email, password, phoneNumber, userRole} = req.body
        if(!userName || !email || !password || !phoneNumber || !userRole ) return {statusCode: 401, status: false, response: "Required all data...", data: null}
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) return ({ statusCode: 401, status: false, message: "Email already registered", data: null})
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            userName,
            email,
            password: hashedPassword,
            phoneNumber
        })
        const foundRoles = await Role.findOne({ where: { name: userRole } })
        await newUser.setRoles(foundRoles)
        const {id: _id, password: _pass, ...userData} = newUser.toJSON()
        return {statusCode: 200, status: true, message: "User registration successfull", data: userData}
    }
    catch(e) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

// verify user
async function verifyUser(req) {
    try{
        const email = req.user.email;
        if(!email) return {statusCode: 401, status: false, message: "Required all data...", data: null}
        const tempUser = await User.findOne({where: {email},include: [
            { model: Role, attributes: ['name'] }
        ]})
        if(!tempUser) return {statusCode: 404, status: false, message: "User not found...", data: null}
        const userRole = tempUser.Roles.map(role => role.name)
        const {id: _id, password: _pass, Roles: _role, ...userData} = tempUser.toJSON()
        return {statusCode: 200, status: true, message: "User authenticate successful", data: {...userData, userRole}}
    }
    catch(e) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }

}

// get all buses
async function getBuses() {
    try {
        const tempBuses = await Bus.findAll({
            attributes: {
                exclude: ['id', 'createdAt', 'updatedAt']
            }
        })
        if(tempBuses.length == 0) return {statusCode: 404, status: false, message: "No bus found", data: null}
        return {statusCode: 200, status: true, message: "Buses found", data: tempBuses}
    }
    catch(e) {
         console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

// get bus schedule
async function getSchedule() {
    try {
        const today = new Date()
        const todayStr = today.toISOString().split('T')[0];
        const busesWithSchedule = await Bus.findAll({
            attributes: {
                exclude: ['id', 'updatedAt', 'createdAt']
            },
            include: {
                model: BusSchedule,
                attributes: [
                    "id",
                    "scheduleDate",
                    [fn("COUNT", col("BusSchedules->Bookings->BookingSeats.id")), "seatsBooked"],
                ],
                where: {
                    scheduleDate: {
                        [Op.gte]: todayStr
                    }
                },
                include: [
                    {
                        model: Booking,
                        attributes: [],
                        required: false,
                        include: [
                            {
                                model: BookingSeat,
                                attributes: [],
                                required: false
                            }
                        ]
                    }
                ]
            },
            group: ["Bus.id", "BusSchedules.id"],
            order: [[BusSchedule, 'scheduleDate', 'DESC']]
        })
        if(busesWithSchedule.length == 0) return {statusCode: 200, status: true, message: "No bus schedule", data: null}
        return {statusCode: 200, status: true, message: "Bus schedules found", data: busesWithSchedule}
    }
    catch(e) {
        console.log(e)
        return {statusCode: 500, status: false, message: "Internal server error", data: null};
    }
}

module.exports = {userLogin, forgetPassword, forgetPasswordReset, userRegistration, verifyUser, getBuses, getSchedule}
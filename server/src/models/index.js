const seqConnection = require('../db/dbConnection')
const bcrypt = require('bcrypt')

// models
const User = require('./User')
const Role = require('./Role')
const Bus = require('./busModel')
const BusSchedule = require('./busSchedule')
const Booking = require('./bookingModel')
const BookingSeat = require('./bookingSeatModel')
const ForgetPassword = require('./ForgetPassword')

// associations
User.belongsToMany(Role, { through: 'UserRoles' })
Role.belongsToMany(User, { through: 'UserRoles' })

Bus.hasMany(BusSchedule, { foreignKey: "busId" });
BusSchedule.belongsTo(Bus, { foreignKey: "busId" });

User.hasMany(Booking, { foreignKey: "userId" });
Booking.belongsTo(User, { foreignKey: "userId" });

BusSchedule.hasMany(Booking, { foreignKey: "scheduleId" });
Booking.belongsTo(BusSchedule, { foreignKey: "scheduleId" });

Booking.hasMany(BookingSeat, { foreignKey: "bookingId" });
BookingSeat.belongsTo(Booking, { foreignKey: "bookingId" });

async function initializeDefaults() {
    const roles = ['admin', 'conductor', 'passenger']
    for (const roleName of roles) {
        const existingRole = await Role.findOne({ where: { name: roleName } })
        if (!existingRole) {
            await Role.create({ name: roleName })
            console.log(`Role '${roleName}' created`)
        }
    }
    const adminEmail = 'admin@bus.com'
    const existingAdmin = await User.findOne({ where: { email: adminEmail } })
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10)
        const adminUser = await User.create({
            userName: 'Super Admin',
            email: adminEmail,
            password: hashedPassword,
            phoneNumber: '0700000000'
        })
        const adminRole = await Role.findOne({ where: { name: 'admin' } })
        await adminUser.addRole(adminRole)
        console.log("Default Admin account created")
        console.log("Email: admin@bus.com")
        console.log("Password: Admin@123")
    }
}

async function syncModels() {
    await seqConnection.sync({ alter: true })
    await initializeDefaults()
    console.log("All models synced with DB...")
}

syncModels()

module.exports = {
    User,
    Role,
    ForgetPassword,
    Booking,
    BookingSeat
}
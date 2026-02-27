const express = require('express')
const router = express.Router()
const {createSchedule, addBus, deleteBus, deleteSchedule, getUsers, getAllBookings, updateBookingStatus} = require('../services/adminServices')
const {verifyToken} = require("../auth/auth")

router.post('/add-bus', verifyToken, async (req, res) => {
        const result = await addBus(req)
        return res.status(result.statusCode).json({status: result.status, message: result.message ?? null, result: result.data ?? null})
})

router.delete('/delete-bus', verifyToken, async (req, res) => {
        const result = await deleteBus(req)
        return res.status(result.statusCode).json({status: result.status, message: result.message ?? null, result: result.data ?? null})
})

router.post('/create-new-schedule', verifyToken, async (req, res) => {
        const result = await createSchedule(req)
        return res.status(result.statusCode).json({status: result.status, message: result.message ?? null, result: result.data ?? null})
})

router.delete('/delete-schedule', verifyToken, async (req, res) => {
        const result = await deleteSchedule(req)
        return res.status(result.statusCode).json({status: result.status, message: result.message ?? null, result: result.data ?? null})
})

router.get('/get-users', verifyToken, async (req, res) => {
        const result = await getUsers()
        return res.status(result.statusCode).json({status: result.status, message: result.message ?? null, result: result.data ?? null})
})

router.get('/get-all-bookings', verifyToken, async (req, res) => {
        const result = await getAllBookings()
        return res.status(result.statusCode).json({status: result.status, message: result.message ?? null, result: result.data ?? null})
})

router.put('/update-booking-status', verifyToken, async (req, res) => {
        const result = await updateBookingStatus(req)
        return res.status(result.statusCode).json({status: result.status, message: result.message ?? null, result: result.data ?? null})
})

module.exports = router
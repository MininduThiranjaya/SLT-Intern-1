const express = require('express')
const router = express.Router()
const {searchSchedule, busSeatBooking} = require('../services/userServices')
const {verifyToken} = require("../auth/auth")

router.post('/search-schedule',verifyToken, async (req, res) => {
        const result = await searchSchedule(req)
        return res.status(result.statusCode).json({status: result.status, message: result.message ?? null, result: result.data ?? null})
})

router.post('/bus-seat-booking',verifyToken, async (req, res) => {
        const result = await busSeatBooking(req)
        return res.status(result.statusCode).json({status: result.status, message: result.message ?? null, result: result.data ?? null})
})

module.exports = router
const express = require('express')
const router = express.Router()
const {createSchedule, addBus, deleteBus, deleteSchedule} = require('../services/adminServices')
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

module.exports = router
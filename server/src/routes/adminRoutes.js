const express = require('express')
const router = express.Router()
const {createSchedule} = require('../services/adminServices')
const {verifyToken} = require("../auth/auth")

router.post('/create-new-schedule',verifyToken, async (req, res) => {
        const result = await createSchedule(req)
        return res.status(result.statusCode).json({status: result.status, message: result.message ?? null, result: result.data ?? null})
})

module.exports = router
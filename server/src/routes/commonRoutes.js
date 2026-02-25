const express = require('express')
const router = express.Router()
const {userLogin, userRegistration, forgetPassword, forgetPasswordReset, verifyUser, getBuses, getSchedule} = require('../services/commonService')
const {verifyToken} = require("../auth/auth")
const { BusSchedule } = require('../models')

router.post('/login', async (req, res) => {
        const result = await userLogin(req)
        return res.status(result.statusCode).json({status: result.status, message: result.message ?? null, result: result.data ?? null})
})

router.get('/verify', verifyToken, async (req, res) => {
        const result = await verifyUser(req)
        return res.status(result.statusCode).json({status: result.status, message: result.message ?? null, result: result.data ?? null})
})

router.post('/reg', async (req, res) => {
        const result = await userRegistration(req)
        return res.status(result.statusCode).json({status: result.status, message: result.message ?? null, result: result.data ?? null})
})

router.post('/forget-password-send-mail', async (req, res) => {
        const result = await forgetPassword(req)
        return res.status(result.statusCode).json({status: result.status, message: result.message ?? null, result: result.data ?? null})
})

router.post('/forget-password-reset', async (req, res) => {
        const result = await forgetPasswordReset(req)
        return res.status(result.statusCode).json({status: result.status, message: result.message ?? null, result: result.data ?? null})
})

router.get('/get-buses', async (req, res) => {
        const result = await getBuses()
        return res.status(result.statusCode).json({status: result.status, message: result.message ?? null, result: result.data ?? null})
})

router.get('/get-schedule', async (req, res) => {
        const result = await getSchedule()
        return res.status(result.statusCode).json({status: result.status, message: result.message ?? null, result: result.data ?? null})
})

module.exports = router
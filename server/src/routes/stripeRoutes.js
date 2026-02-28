const express = require('express')
const router = express.Router()
const {webhookConnection} = require('../services/userServices')

router.post('/stripe-webhook', express.raw({ type: "application/json" }), async (req, res) => {
        const result = await webhookConnection(req)
        return res.status(result.statusCode).json(result.data ?? null)
})

module.exports = router
const { response } = require('express')
const jwt = require('jsonwebtoken')
require('dotenv')

async function generateWebToken(tempUser, userRole) {
    const jwtSecret  = process.env.JWT_TOKEN
    const token = jwt.sign(
        {email: tempUser.email, role: userRole},
        jwtSecret,
        {expiresIn: '1d'}
    )

    return token
}

async function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization
        if(!authHeader) return res.status(401).json({ status: false, response: 'No authorization header provided'})
        if(!authHeader.startsWith("Bearer ")) return res.status(401).json({ status: false, response: "Invalid token format"});
        const token = authHeader.split(" ")[1]
        const decode = jwt.verify(token, process.env.JWT_TOKEN)
        req.user = decode
        next()
    }
    catch(e) {
        console.log(e)
        if (e.name === "TokenExpiredError") {
            return res.status(401).json({ status: false, response: "Token expired"});
        }
        return res.status(403).json({ status: false, response: "Invalid token",});
    }
}

module.exports = {generateWebToken, verifyToken}
const {StatusCodes} = require("http-status-codes")
const jwt = require("jsonwebtoken")
const User = require("../Models/Users")

const authMiddleWare = async (req , res , next) => {
    const token = req.cookies.access_token 
    if(!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({message : "You need to sign in "})
    }


    try {
        const decoded = await jwt.verify(token , process.env.SECRET_KEY)
        const user = await User.findById(decoded.userId)
        req.user = user 
        next()
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : error.message})
    }
}

module.exports = authMiddleWare
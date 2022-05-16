const User = require("../Models/Users")
const {StatusCodes} = require("http-status-codes")
const ConflictError = require("../Errors/conflict")
const BadRequestError = require("../Errors/badRequest")
const UnAuthenticatedError = require("../Errors/unAuthenticated")
const jwt = require("jsonwebtoken")
const asyncWrapper = require("./asyncWrapper")

const register = asyncWrapper(async (req , res , next) => {
    // check email already exist 
    const existEmail = await User.findOne({email : req.body.email})
    if (existEmail) throw new ConflictError("Email already exist")

    const user = await User.create({...req.body})
    res.status(StatusCodes.CREATED).json({user})


})

const login = asyncWrapper( async (req , res , next) => {
    const {email , password} = req.body
    
    if(!email || !password) throw new BadRequestError("Please provide email and password")

    const user = await User.findOne({email})
    if (!user) throw new UnAuthenticatedError("wrong email")

    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect) throw new UnAuthenticatedError("wrong password")

    const accessToken = await user.createAccessToken()
    const refreshToken = await user.createRefreshToken()

    res.json({user , accessToken , refreshToken})

})


const refreshToken = asyncWrapper(async (req , res , next) => {
    const {token : refreshToken} = req.body ; 
    if(!refreshToken) {
        throw new UnAuthenticatedError("No refresh token provided");
    }
    const payload = await jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET_KEY)

    const user  = await User.findById(payload.userId)
    if(!user) throw new UnAuthenticatedError("User not found")
    
    const accessToken = await user.createAccessToken() 
    const newRefreshToken = await user.createRefreshToken ()
    res.json({accessToken , refreshToken : newRefreshToken})

})
module.exports = {
    register , login , refreshToken 
}
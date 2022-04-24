const User = require("../Models/Users")
const {StatusCodes} = require("http-status-codes")
const ConflictError = require("../Errors/conflict")
const BadRequestError = require("../Errors/badRequest")
const UnAuthenticatedError = require("../Errors/unAuthenticated")
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

    const token = await user.createJwt()

    res.json({user , token})

})
module.exports = {
    register , 
    login
}
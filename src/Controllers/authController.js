const User = require("../Models/Users")
const {StatusCodes} = require("http-status-codes")

const register = async (req , res) => {
    try {
       // check email already exist 
        const existEmail = await User.findOne({email : req.body.email})
        if (existEmail) {
            return res.status(StatusCodes.CONFLICT).json({message : "Email already exist"})
        }

        const user = await User.create({...req.body})
        res.status(StatusCodes.CREATED).json({user})

   } catch (error) {
       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : error.message})
   }

}

const login = async (req , res) => {
    const {email , password} = req.body
    if(!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({message : "Please provide email and password"})
    }

    try {
        const user = await User.findOne({email})
        if (!user) return res.status(StatusCodes.NOT_FOUND).json({message : "wrong email"})

        const isPasswordCorrect = await user.comparePassword(password)
        if(!isPasswordCorrect) return res.status(StatusCodes.NOT_FOUND).json({message : "wrong password"})

        const token = await user.createJwt()

        res.json({user , token})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : error.message})
    }
}

module.exports = {
    register , 
    login
}
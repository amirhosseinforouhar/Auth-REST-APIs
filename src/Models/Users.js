const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const Schema = mongoose.Schema

const userSchema = new Schema({
    username : {
        type : String , 
        required : [true , "Please provide username"] , 
        minlength : 3 ,
        trim : true , 
        maxlength : 25 
    }, 
    email : {
        unique : true , 
        type : String , 
        required : [true , "Please provide email"] , 
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

    }, 
    password : {
        type : String , 
        required : [true , "Please provide password"] , 
        minlength  : 6 , 
        trim : true 

    }
})

userSchema.pre("save" , async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password , salt)
    next()
})

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password , this.password)
}

userSchema.methods.createAccessToken = function () {
    return jwt.sign({userId : this._id , username : this.username} , process.env.SECRET_KEY , {
        expiresIn : process.env.ACCESS_TOKEN_LIFE_TIME
    })
}

userSchema.methods.createRefreshToken = function () {
    return jwt.sign({userId : this._id , username : this.username} , process.env.REFRESH_TOKEN_SECRET_KEY , {
        expiresIn : process.env.REFRESH_TOKEN_LIFE_TIME
    })
}

const User = mongoose.model("users" , userSchema)

module.exports = User
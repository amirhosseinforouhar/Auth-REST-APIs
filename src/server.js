const express = require('express');
const helmet = require("helmet")
const connectDB = require('./db/connectDB');
const authMiddleWare = require('./Middlewares/authMiddleWare');
const authRouter = require("./Routes/auth")
const dashboardRouter = require("./Routes/dashboard")

const app = express ()
require("dotenv").config({path : `${__dirname}/Configs/config.env`})

app.use(express.json())
app.use(helmet())

app.use("/auth" , authRouter)
app.use("/dashboard" , authMiddleWare , dashboardRouter)

const PORT = process.env.PORT || 3000 
const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI)

        app.listen(PORT , () => {
            console.log(`server running on port ${PORT}...`);
        })
    } catch (error) {
        console.log(error);
    }
}
start()
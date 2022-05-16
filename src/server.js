const express = require("express");
const connectDB = require("./db/connectDB");
const authMiddleWare = require("./Middlewares/authMiddleWare");
const errorHandlerMiddleWare = require("./Middlewares/errorHandlerMiddleWare");
const helmet = require("helmet");
const authRouter = require("./Routes/auth");
const dashboardRouter = require("./Routes/dashboard");

const app = express();
require("dotenv").config({ path: `${__dirname}/Configs/config.env` });

// middlewares 
app.use(express.json());
app.use(helmet());

// routes 
app.use("/auth", authRouter);
app.use("/dashboard", authMiddleWare, dashboardRouter);

// error handler middleware 
app.use(errorHandlerMiddleWare);

// database connection 
connectDB()

// start server 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}...`);
});

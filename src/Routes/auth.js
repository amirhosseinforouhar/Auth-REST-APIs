const {Router} = require('express');
const router = Router()

const {register , login , refreshToken} = require("../Controllers/authController")

router.post("/register" , register )
router.post("/login" , login )
router.post("/refresh" , refreshToken)

module.exports = router 
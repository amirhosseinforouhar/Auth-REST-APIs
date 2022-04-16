const {Router} = require('express');
const router = Router()

const {register , login} = require("../Controllers/authController")

router.post("/register" , register )
router.post("/login" , login )

module.exports = router 
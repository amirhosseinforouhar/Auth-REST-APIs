const {Router} = require('express');
const router = Router()

const {getDashboard} = require("../Controllers/dashboardController")

router.get("/" , getDashboard)

module.exports = router 
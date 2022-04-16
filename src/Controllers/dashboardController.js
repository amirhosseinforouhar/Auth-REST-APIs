const getDashboard = (req , res) => {
    res.send(`Welcome ${req.user.username}`)
}
module.exports = {
    getDashboard
}
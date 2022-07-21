const sendJwtInCookie = (res , accessToken , refreshToken) => {
    res.cookie('access_token' , accessToken , {
        httpOnly : true ,
        secure : true 
    })
    res.cookie("refresh_token" , refreshToken , {
        httpOnly : true , 
        secure : true 
    })
}

module.exports = sendJwtInCookie ; 
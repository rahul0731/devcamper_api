const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorReponse = require('../utils/errorResponse');
const User = require('../models/User');

//Protect routes
exports.protect = asyncHandler(async (req,res,next) =>{
    let token;
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
     ){
         //Set token from Bearer token in header
            token = req.headers.authorization.split(' ')[1];
     }
    //  //Set token from cookie
    //  else if(req.cookies.token){
    //      token = req.cookies.token
    //  }

    //Make Sure token exists
    if(!token){
        return next(new ErrorReponse('Not authorized to access this route' , 401));
    }

    try {
        //verify token 
       const decoded = jwt.verify(token,process.env.JWT_SECRET);
       console.log(decoded);
       req.user = await User.findById(decoded.id);
       next();
    } catch (error) {
        return next(new ErrorReponse('Not authorized to access this route' , 401));
    }
});

//Grant access to specific roles
exports.authorize = (...roles) => {
    return(req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorReponse(`User role ${req.user.role} is not authoized to access this route` , 403));
        }
        next();
    }
}
const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res ,next) => {
    let error = {...err};

    error.message = err.message;
    //Log to console for developer
    console.log(err.name);
    //Mongoose bad ObjectId
    if(err.name === 'CastError'){
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message,404);
        console.log('error-----',error)
    }

    //Mongoose duplicate key 
    if(err.code === 11000){
        const message = 'Duplicate field value entered';
        console.log(message);
        error = new ErrorResponse(message , 400);
    }

    //Mongoose validation error
    if(err.name  === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        console.log(message);
        error = new ErrorResponse(message,400);
    }
    res.status(err.statusCode).json({
        success :false,
        error : err.message || 'Server Error'
    });
}

module.exports = errorHandler;
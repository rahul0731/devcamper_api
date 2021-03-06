const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookiesParser = require('cookie-parser')
const fileUpload = require('express-fileupload');
const path = require('path');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
//Load env vars
dotenv.config({path:'./config/config.env'});
const app = express();

//connect to database
connectDB();
//Route Files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/course');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/review');
//Body Parser
app.use(express.json());

//Cookies parser
app.use(cookiesParser());

//Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//File Uploading
app.use(fileUpload());


//Sanitize data
app.use(mongoSanitize());

//Set Security  header
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate limiting
const limiter = rateLimit({
    windowMs : 10* 60* 1000, //10 mins
    max : 3
});

app.use(limiter);

//Prevent http param pollution
app.use(hpp());


//Enable CORS
app.use(cors());

//set static folder
app.use(express.static(path.join(__dirname,'public')));

// Mount routers
app.use('/api/v1/bootcamps' , bootcamps);
app.use('/api/v1/courses' , courses);
app.use('/api/v1/auth' , auth);
app.use('/api/v1/users' , users);
app.use('/api/v1/reviews' , reviews);
app.use(errorHandler);
const PORT = process.env.PORT || 5000; 
const server = app.listen(
    PORT , console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold)
 );


//Handle unhandle promise rejections
process.on('unhandledRejection' ,(err,promise) =>{
    console.log(`Error :  ${err.message} `.red);
    //close server & exit process
    server.close( () => process.exit(1)); 
});
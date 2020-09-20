const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');


//Load env vars
dotenv.config({path:'./config/config.env'});
const app = express();

//connect to database
connectDB();
//Route Files
const bootcamps = require('./routes/bootcamps');


//Dev loggin middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
// Mount routers
app.use('/api/v1/bootcamps' , bootcamps);
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
const Course = require('../models/course');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

//@desc   Get courses
//@route  Get /api/v1/courses
//@route  Get /api/v1/bootcamps/courses:bootcampId/courses
//@access Public

exports.getCourses = asyncHandler(async (req,res,next) => {
    let query;
    
    if(req.params.bootcampId){
        query = Course.find( { bootcamp : req.params.bootcampId});

    }else{
        query = Course.find().populate({
            path : 'bootcamp',
            select : 'name description'
        })
       
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count : Course.length,
        data : courses
    });
})
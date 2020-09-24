const Course = require('../models/course');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');

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

//@desc   Get SINGLE courses
//@route  Get /api/v1/courses/:ID
//@access Public


exports.getCourse = asyncHandler(async (req,res,next) => {
    const course = await (await Course.findById(req.params.id)).populate({
        path : 'bootcamp',
        select : 'name description'
    })
   if(!course) {
       return next(
           new ErrorResponse(`No courses with the id of ${req.params.id}`),
           404
       );
   }

    res.status(200).json({
        success: true,
        count : Course.length,
        data : course
    });
})


//@desc   Add  courses
//@route  Get /api/v1/bootcamps/:bootcampId/courses
//@access Private


exports.addCourse = asyncHandler(async (req,res,next) => {

    req.body.bootcamp = req.params.bootcampId;


    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
   if(!bootcamp) {
       return next(
           new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),
           404
       );
   }

   const course = await Course.create(req.body);
   
    res.status(200).json({
        success: true,
        count : Course.length,
        data : course
    });
})

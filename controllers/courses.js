const Course = require('../models/course');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');

//@desc   Get courses
//@route  Get /api/v1/courses
//@route  Get /api/v1/bootcamps/courses:bootcampId/courses
//@access Public

exports.getCourses = asyncHandler(async (req,res,next) => {
    if(req.params.bootcampId){
      const  courses = await Course.find( { bootcamp : req.params.bootcampId});
      return res.status(200).json({
          success : true,
          count : courses.length,
          data : courses
      });
    }else{
        res.status(200).json(res.advancedResults);
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
    const course = await Course.findById(req.params.id)
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
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    if(!bootcamp) {
       return next(
           new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),
           404
       );
   }

    //make sure user is bootcamp owner
    if(bootcamp.user.toString() !== req.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponse(`User ${req.params.id} is not authorized to add a course to bootcamp ${bootcamp._id}` ,401)
        );
    }

   const course = await Course.create(req.body);
   
    res.status(200).json({
        success: true,
        count : Course.length,
        data : course
    });
})



//@desc   Update  courses
//@route  put/api/v1/courses/:id
//@access Private

exports.updateCourse = asyncHandler(async (req,res,next) => {

    let  course = await Course.findById(req.params.id)
   if(!course) {
       return next(
           new ErrorResponse(`No course with the id of ${req.params.id}`),
           404
       );
   }

   //make sure user is course owner
   if(course.user !== req.user.id && req.user.role !== 'admin'){
    return next(
        new ErrorResponse(`User ${req.params.id} is not authorized to update  course ${course._id}` ,401)
    );
}
    course = await Course.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
    })
    res.status(200).json({
        success: true,
        data : course
    });
})



//@desc   Delete  courses
//@route  DELETE /api/v1/bootcamps/:bootcampId/courses
//@access Private

exports.deleteCourse = asyncHandler(async (req,res,next) => {

    const  course = await Course.findById(req.params.id)
   if(!course) {
       return next(
           new ErrorResponse(`No course with the id of ${req.params.id}`),
           404
       );
   }
    //make sure user is course owner
    if(course.user !== req.user.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to delete  course ${course._id}` ,401)
        );
    }
   await course.remove();
    res.status(200).json({
        success: true,
        data : {}
    });
})
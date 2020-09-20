const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { red } = require('colors');
//@desc   Get all bootcamps
//@route  Get /api/v1/bootcamps
//@access Public

exports.getBootcamps = asyncHandler(async(req,res,next) => {
   
        const bootcamps = await Bootcamp.find();
        res.status(200)
        .json({success : true , count : bootcamps.length ,data : bootcamps});
    
});

//@desc   Get Single bootcamps
//@route  Get /api/v1/bootcamps
//@access Public

exports.getBootcamp = asyncHandler(async (req,res,next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);
       if (!bootcamp) {
        return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404 ));
       }
       res.status(200).json({success : true , data : bootcamp});
        // res.status(400).json({success : false , err : err});
});

//@desc   Create new bootcamps
//@route  POST /api/v1/bootcamps
//@access Private

exports.createBootcamp = asyncHandler(async(req,res,next) => {
    const bootcamp = await Bootcamp.create(req.body);
    console.log(req.body);
    res.status(201).json({success : true , data : bootcamp})
    //    next(new ErrorResponse(err,404));
});

//@desc   Update  bootcamps
//@route  POST /api/v1/bootcamps
//@access Private

exports.updateBootcamp = asyncHandler(async(req,res,next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id , req.body ,{
        new :true,
        runValidators : true
    });
   
    if (!bootcamp) {
        return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404 ));
    }
    res.status(200).json({success : true , msg : `update  bootcamps ${req.params.id}`  ,data : bootcamp})
    console.log("Updated data :" , req.body );
})

//@desc   Delete  bootcamps
//@route  POST /api/v1/bootcamps
//@access Private

exports.deleteBootcamp = asyncHandler(async(req,res,next) => {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
       
        if (!bootcamp) {
            return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404 ));
        }
        res.status(200).json({success : true , msg : `delete  bootcamps ${req.params.id}`  ,data : {}})
});
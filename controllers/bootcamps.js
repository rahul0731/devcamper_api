const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const { red } = require('colors');
//@desc   Get all bootcamps
//@route  Get /api/v1/bootcamps
//@access Public

exports.getBootcamps = asyncHandler(async(req,res,next) => {
      res.status(200).json(res.advancedResults);
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

        bootcamp.remove();
        res.status(200).json({success : true , msg : `delete  bootcamps ${req.params.id}`  ,data : {}})
});


//@desc   Get bootcamps with a radius
//@route  Get /api/v1/bootcamps/radius/:zipcode/:distance
//@access Private

exports.getBootcampsInRadius = asyncHandler(async(req,res,next) => {
    const { zipcode ,distance} = req.params;
    //Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //calulate radius using radians
    //Divide dist by radius of earth
    //Earth Radius = 3,963 miles / 6,378 Km
    const radius  = distance / 6378;
    const bootcamps = await Bootcamp.find({
        location: {$geoWithin : {$centerSphere :[[lng,lat],radius]}}
    });

    res.status(200).json({
        success :true,
        count : bootcamps.length,
        data : bootcamps
    })
});


//@desc   Upload Photo for  bootcamps
//@route  PUT /api/v1/bootcamps/:id/photo
//@access Private

exports.bootcampPhotoUpload = asyncHandler(async(req,res,next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
   
    if (!bootcamp) {
        return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404 ));
    }

    if(!req.files){
        return next(new ErrorResponse('Please upload a file' , 400));
    }
    console.log(req.files.file);
    const file = req.files.file;
    //Make sure the image is a photo
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse('Please upload an image file' , 400));
    }

    //check filesize
    if(file.size > process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}` , 400)); 
    }
    //Create custom filename
    
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    console.log(file.name);
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.log(err);
            return next(new ErrorResponse(`Problem with file upload` , 500)); 
        }

        await Bootcamp.findByIdAndUpdate(req.params.id , { photo :file.name});
        res.status(200).json({
            success :true,
            data : file.name
        })
    })
    
});
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const { red } = require('colors');
//@desc   Get all bootcamps
//@route  Get /api/v1/bootcamps
//@access Public

exports.getBootcamps = asyncHandler(async(req,res,next) => {
        
        let query ;
        //Copy req.query
        const reqQuery = {...req.query };
        //Fields to exclude
        const removeFields = ['select','sort','page','limit'];

        //Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);
        
        //create query string
        let queryStr = JSON.stringify(req.query);

        //Create Operators ($gt,$gte,etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match => `$${match}`);
        //Finding resource
        query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');
        //Select Fields
        if(req.query.select){
            const fields = req.query.select.split(',').join(' ');
            console.log(fields)
            query = query.select(fields);
        }

        //Sort
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            console.log(sortBy);
            query = query.sort(sortBy);
        }else{
            query =  query.sort('-createdAt');

        }

        //Pagination 
        const page = parseInt(req.query.page,10) || 1;
        const limit = parseInt(req.query.limit,10) || 100;
        const starIndex = (page-1) * limit;
        const endIndex = page * limit;
        const total = await Bootcamp.countDocuments();

        query = query.skip(starIndex).limit(limit);

        //Executing Query
        const bootcamps = await query;

        //Pagination result
        const pagination = {};

        if(endIndex < total) {
            pagination.next = {
                page : page + 1,
                limit 
            }
        }

        if(starIndex > 0){
            pagination.prev = {
                page : page -1,
                limit
            }
        }
        res 
            .status(200)
            .json({success : true , count : bootcamps.length,pagination,
                data :bootcamps});
        console.log(bootcamps);
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


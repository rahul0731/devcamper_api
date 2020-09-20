//@desc   Get all bootcamps
//@route  Get /api/v1/bootcamps
//@access Public

exports.getBootcamps = (req,res,next) => {
    res.status(200).json({success : true , msg : `Show all bootcamps`});
}

//@desc   Get Single bootcamps
//@route  Get /api/v1/bootcamps
//@access Public

exports.getBootcamp = (req,res,next) => {
    res.status(200).json({success : true , msg : `Show Single bootcamps ${req.params.id}` });
}

//@desc   Create new bootcamps
//@route  POST /api/v1/bootcamps
//@access Private

exports.createBootcamp = (req,res,next) => {
    res.status(201).json({success : true , msg : `Create new bootcamps ${req.params.id}` })
}

//@desc   Update  bootcamps
//@route  POST /api/v1/bootcamps
//@access Private

exports.updateBootcamp = (req,res,next) => {
    res.status(201).json({success : true , msg : `update  bootcamps ${req.params.id}` })
}

//@desc   Delete  bootcamps
//@route  POST /api/v1/bootcamps
//@access Private

exports.deleteBootcamp = (req,res,next) => {
    res.status(201).json({success : true , msg : `delete bootcamps ${req.params.id}` })
}
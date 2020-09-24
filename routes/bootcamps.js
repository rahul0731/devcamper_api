const express = require('express');
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    deleteBootcamp,
    updateBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
}  = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

//Include other resource routers
const courseRouter = require('./course');
const router = express.Router();
//re-route into other resources routers
router.use('/:bootcampId/courses',courseRouter);
router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

router.route('/:id/photo').put(bootcampPhotoUpload);
router
    .route('/')
    .get(advancedResults(Bootcamp ,'courses'), getBootcamps)
    .post(createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);
    
module.exports = router;
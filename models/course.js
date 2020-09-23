const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
    title : {
        type : String,
        trime : true,
        required : [true , 'please add a course title']
    },
    description : {
        type : String,
        required : [true , 'Please add a description']

    },
    weeks : {
        type :Number,
        required : [true ,'Please add weeks of Courses']
    },
    tuition : {
        type : Number ,
        required : [true , 'Please add a tution cost']
    },
    minimumSkill  : {
        type : String,
        required :[true , 'Pleass add a minimum skill '],
        enum : ['beginner' , 'intermediate' , 'advanced']
    },
    scholarshipAvailable : {
        type : Boolean,
        default : false
    },
    createdAt :{
        type : Date,
        default : Date.now
    },
    bootcamp : {
        type : mongoose.Schema.ObjectId,
        ref : 'Bootcamp',
        required : true
    }
    

});

module.exports = mongoose.model('Course' ,CourseSchema);
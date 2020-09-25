const { blue } = require('colors');
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
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    }
    

});

//Static method to get average of course tuitions
CourseSchema.statics.getAverageCost = async function(bootcampId){
    console.log('Calculating avg cost......' . blue);
    const obj = await this.aggregate([
        {
            $match : {bootcamp : bootcampId}
        },
        {
            $group : {
                _id : '$bootcamp',
                averageCost : {$avg : '$tuition'}
            }
        }
    
    ]);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
            averageCost : Math.ceil(obj[0].averageCost /10) * 10
        })
    } catch (err) {
        console.error(err);
    }
    // console.log(obj);
}
//Call getAverageCost after save
CourseSchema.post('save' ,function() {
    this.constructor.getAverageCost(this.bootcamp);
})
//Call getAverageCost before remove
CourseSchema.pre('remove' ,function() {
    this.constructor.getAverageCost(this.bootcamp);
})

module.exports = mongoose.model('Course' ,CourseSchema);
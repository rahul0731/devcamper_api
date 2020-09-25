const { blue } = require('colors');
const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
    title : {
        type : String,
        trime : true,
        required : [true , 'please add a title for the review'],
        maxlength : 100
    },
    text : {
        type : String,
        required : [true , 'Please add a some text']

    },
    rating : {
        type :Number,
        min : 1,
        max: 10,
        required : [true ,'Please add a rating 1 and 10']
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
//Prevent User form submitting more than one review on bootcamp
ReviewSchema.index({bootcamp : 1, user:1 } ,{unique : true})

module.exports = mongoose.model('Review' ,ReviewSchema);
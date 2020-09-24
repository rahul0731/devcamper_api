const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');
const BootcampSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true , 'Please add a name'],
        unique : true,
        trim : true,
        maxlength : [50 , 'Name can not be more than 50 character'],
    },
    slug : String,
    description : {
        type : String,
        required : [true , 'Please add a description'],
        maxlength : [500 , 'Name can not be more than 500 character'],
    },
    website:{
        type :String,
        match : [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    phone:{
        type : String,
        maxlength : [10, 'Please number can not be longer than 10 digit']
    },
    email : {
        type : String,
        match : [
           /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
           'Please add a valid email'
        ]
    },
    address :{
        type : String,
        require : [true , 'Please add an address']
    },
    location :{
        //GeoJSON
        type: {
            type: String,
            enum: ['Point'],
            required: false
          },
          coordinates: {
            type: [Number],
            required: false,
            index : '2dsphere'
          },
          formattedAddress : String,
          street : String,
          city : String,
          state : String,
          zipcode : String,
          country : String,
    },

    careers : {
        //Arrays of strings
        type  : [String],
        required : true ,
        enum : [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating :{
        type :Number,
        min : [1, 'Rating must be at least 1'],
        max : [10, 'Rating must can not be more than  10']
    },
    averageCost : Number,
    photo :{
        type: String,
        default : 'no-php.jpg'
    },
    housing :{
        type: Boolean,
        default :false
    },
    jobAssistance : {
        type: Boolean,
        default : false
    },
    jobGuarantee : {
        type :Boolean,
        default :false
    },
    acceptGi : {
        type: Boolean,
        default : false
    },
    createdAt : {
        type :Date,
        default :Date.now
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    }
},
//Create Virtual Populate
    {
        toJSON : {
            virtuals : true,
        },
        toObject : {
            virtuals : true
        }
    }
);

//create bootcamp slung from the name
BootcampSchema.pre('save' , function(next){
    this.slug = slugify(this.name , {lower : true} );
    console.log('Slugigy ran' , this.name)
    next();
});

//GeoCode & Create Location field
BootcampSchema.pre('save', async function(next){
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type : 'Point',
        coordinates : [loc[0].longitude , loc[0].latitude],
        formattedAddress : loc[0].formattedAddress,
        street : loc[0].streetName,
        city : loc[0].city,
        state : loc[0].state,
        zipcode : loc[0].zipcode,
        country : loc[0].countryCode,
    };
    //Do not saved address in db
    this.address = undefined;
    next()
});
//Casecade delete courses when a bootcamp is deleted
BootcampSchema.pre('remove' , async function(next) {
    console.log(`Courses being removed from bootcamp ${this._id}`)
    await this.model('Course').deleteMany({bootcamp : this._id});
    next();
})

//Reverse populate with vituals
BootcampSchema.virtual('courses',{
    ref : 'Course',
    localField : '_id',
    foreignField : 'bootcamp',
    justOne : false
})
module.exports = mongoose.model('Bootcamp', BootcampSchema);
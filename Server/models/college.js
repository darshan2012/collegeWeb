
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sliderSchema=new Schema({
    url:{
        type:String,
    }
},{
    timestamps: true
})
const postSchema=new Schema({
    url:{
        type:String,
        required:true
    },
    caption:{
        type:String,
    },
    likes:{
        type:Number,
        default:0
    },
 
    likedUser:[]

},{
    timestamps: true
})

const aboutSchema = new Schema({
    imageUrl: {
        type: String
    },
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

const noticeSchema = new Schema({
    description: {
        type: String
    },
    noticeLink: {
        type: String
    }
},{
    timestamps: true
})
const noticeBlockSchema = new Schema({
    noticeTitle: {
        type: String
    },
    isPinned:{
        type:Boolean,
        default:false
    },
    notice: [noticeSchema]
},{
    timestamps: true
})

const AcademicSchema=new Schema({
    courseName:{
        type:String,
    },
    courseDescription:{
        type:String
    },
    fees:{
        type:String
    },
    imageUrl:{
        type:String
    },
    duration:{
        type:String,
    }
})

const collegeSchema = new Schema({
    admin:{
        type:String,
       
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNo:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: Number,
        required: true
    },
    followers: {
        type: Number,
        required: true
    },
    logo: {
        type: String
    },
    imageList : [sliderSchema],
    posts: [postSchema],
    notices: [noticeBlockSchema],
    aboutUs: [aboutSchema],
    Academics:[AcademicSchema]
},{
    timestamps: true
})

var Colleges = mongoose.model('College', collegeSchema);

module.exports = Colleges;
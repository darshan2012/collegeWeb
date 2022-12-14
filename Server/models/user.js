const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMonngoose=require('passport-local-mongoose');


const user=new Schema({

    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    followedColleges:[],
    createdColleges:[]
},{
    timestamps: true
})

user.plugin(passportLocalMonngoose);

module.exports=mongoose.model('user',user);
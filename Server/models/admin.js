const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

const admin = new Schema({
    
})
admin.plugin(passportLocalMongoose);
module.exports = mongoose.model('Admin',admin)
    
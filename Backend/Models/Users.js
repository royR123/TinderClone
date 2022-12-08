const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    user_id : {
        type : String,
        required : true
    } ,
    hashed_password : {
        type : String,
        required : true
    } ,
    first_name : {
        type : String
    } , 
    dob_day : {
        type : Number
    }  ,
    dob_month : {
        type : Number
    }  ,
    dob_year : {
        type : Number
    }  ,
    show_gender : {
        type : Boolean,
    } ,
    gender_identity : {
        type : String
    } ,
    gender_interest : {
        type : String
    } ,
    email : {
        type : String,
        required : true,
        unique : true
    } ,
    url : {
        type : String,
    } ,
    about : {
        type : String
    } ,
    matches : [ String ]
})

module.exports = mongoose.model('Users',UserSchema);

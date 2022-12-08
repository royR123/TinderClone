const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const MessageSchema = new Schema({
    timeStamp : {
        type : String,
        required : true
    },
    from_user_id : {
        type : String,
        required : true
    },
    to_user_id : {
        type : String,
        required : true
    },
    message :{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Messages',MessageSchema);

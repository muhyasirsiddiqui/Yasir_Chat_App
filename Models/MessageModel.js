//import mongoose from 'mongoose';
var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    Name : {
        type: String   
    },
    Content : {
        type : String
    },
    Created_Date:{
        type:Date,
        default: Date.now()
    }

});
module.exports = mongoose.model('Message', MessageSchema);
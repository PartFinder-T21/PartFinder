const mongoose = require("mongoose"); //import mongoose

const UserSchema = new mongoose.Schema({
username: {type:String, required:true},
email: {type:String, required:true},
password: {type:String, required:true},
image: String,
description: String,
reputation: Number,
isVerified: Boolean
});
const User = mongoose.model('User', UserSchema); 
module.exports = User;
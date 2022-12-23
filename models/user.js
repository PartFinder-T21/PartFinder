const mongoose = require("mongoose"); //import mongoose

const UserSchema = new mongoose.Schema({
username: {type:String, required:true,unique:true},
email: {type:String, required:true,unique:true},
password: {type:String, required:true},
image: String,
description: String,
reputation: Number,
isVerified: Boolean,
upvotes:[String],
downvotes:[String],
});
const User = mongoose.model('User', UserSchema); 
module.exports = User;
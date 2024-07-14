const mongoose = require("mongoose"); //import mongoose

const GroupSchema = new mongoose.Schema({
code:{type:String, required:true,unique:true},
master:{id:{type: String, required: true},username:{type:String, required:true}},
name:{type:String,required:true},
description:String,
size:{type:Number,required:true},
characters:[{user:String,username:String ,character:String,characterName:String}], //Array containing characters IDs who joined the group
requests:[{user:String,username:String,character:String,characterName:String}], //Array containing characters IDs with pending request
messages:[{username:String,message:String,isMaster:Boolean}]
});
const Group = mongoose.model('Group', GroupSchema); 
module.exports = Group;
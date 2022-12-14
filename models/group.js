const mongoose = require("mongoose"); //import mongoose

const GroupSchema = new mongoose.Schema({
code:{type:String, required:true},
master:{type:String,required:true},
name:{type:String,required:true},
description:String,
size:{type:Number,required:true},
characters:[String], //Array containing characters IDs who joined the group
requests:[String] //Array containing characters IDs with pending request
});
const Group = mongoose.model('Group', GroupSchema); 
module.exports = Group;
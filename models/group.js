const mongoose = require("mongoose"); //import mongoose

const GroupSchema = new mongoose.Schema({
code:{type:String, required:true},
master:{type:String,required:true},
description:String,
size:{type:Number,required:true},
players: [{user: User}],
characters:[{character:Character}]
});
const Group = mongoose.model('Group', GroupSchema); 
module.exports = GroupSchema;
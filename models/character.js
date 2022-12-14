const mongoose = require("mongoose"); //import mongoose

const CharacterSchema = new mongoose.Schema({
user: {type:String, required:true},
image:String,
name:{type:String, required:true},
stats: [{stat:String,value:Number,required:true}],
inventory: [String],
class:String,
});
const Character = mongoose.model('Character', CharacterSchema); 
module.exports = CharacterSchema;
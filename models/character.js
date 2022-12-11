const mongoose = require("mongoose"); //import mongoose

const CharacterSchema = new mongoose.Schema({
user: {type:User, required:true},
image:String,
name:{type:String, required:true},
stats: [{stat:Number}],
inventory: [String],
isValid: Boolean
});
const Character = mongoose.model('Character', CharacterSchema); 
module.exports = CharacterSchema;
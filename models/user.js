const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const uuid=require('uuid');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    about: {type:String,trim:true},
    salt:String,
    role: {type:Number,default:0},
    history:{type:Array,default:[]},
},{timestamps:true});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);



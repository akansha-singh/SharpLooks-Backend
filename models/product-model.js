const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: { type: String, required: true,maxlength: 32 },
    description: { type: String, required: true,maxlength:200 },
    price: { type: Number, required: true,maxlength: 32 },
    category:{ type:ObjectId,ref:"Category", required: true},
    quatity:{type: Number, required: true},
    sold:{type: Number, required: true,default:0},
    photo:{data:Buffer,contentType:String},
    shipping:{required:false,type:Boolean}

},{timestamps:true});

productSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Products', productSchema);



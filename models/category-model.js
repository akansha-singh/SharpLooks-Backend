const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { type: String, required: true },
},{timestamps:true});

categorySchema.plugin(uniqueValidator);

module.exports = mongoose.model('Category', categorySchema);
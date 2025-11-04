// File: `models/item.model.js`
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }, // filename or URL
    category: { type: String, enum: ['coffee', 'chocolate', 'other'], required: true },
    description: { type: String } // optional description field
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
// javascript
// File: `models/item.model.js`
const mongoose = require('mongoose');

// Option 1: set explicit collection name in schema options
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, enum: ['coffee', 'chocolate', 'other'], required: true },
    description: { type: String }
}, { timestamps: true, collection: 'item' }); // explicit collection name

module.exports = mongoose.model('Item', itemSchema);

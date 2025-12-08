const mongoose = require("mongoose");

const favoritesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users" // Reference to User model
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "products" // Reference to products model
    },
});

module.exports = mongoose.model("favorites", favoritesSchema);
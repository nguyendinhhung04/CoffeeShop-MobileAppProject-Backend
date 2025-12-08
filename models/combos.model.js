const mongoose = require("mongoose");

const combosSchema = new mongoose.Schema({
    _id: String,
    name: String,
    description: String,
    category: String,
    basePrice: Number,
    image_url: String,
    discount: Number, // Phần trăm giảm giá
    discountedPrice: Number, // Giá sau giảm

    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "products" // Reference to User model
            },
            productName: String,
            quantity: Number,
        },
    ],

    isActive: Boolean,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("combos", combosSchema);
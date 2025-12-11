const mongoose = require("mongoose");

const ComboItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "products"
    },
    requiredQty: {
        type: Number,
        required: true,
        min: 1
    }
}, { _id: false });

const PromotionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        enum: ["PERCENT", "FIXED_AMOUNT", "FIXED_PRICE_COMBO"],
        required: true
    },
    scope: {
        type: String,
        enum: ["ORDER", "PRODUCT", "CATEGORY", "COMBO"],
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    minOrderTotal: {
        type: Number,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // For PRODUCT scope
    productIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    }],
    // For CATEGORY scope
    categories: [String],
    // For COMBO scope
    comboItems: [ComboItemSchema]
});

// Validation: ensure correct fields are present based on scope
PromotionSchema.pre("save", function(next) {
    if (this.scope === "PRODUCT" && (!this.productIds || this.productIds.length === 0)) {
        return next(new Error("productIds is required for PRODUCT scope"));
    }
    if (this.scope === "CATEGORY" && (!this.categories || this.categories.length === 0)) {
        return next(new Error("categories is required for CATEGORY scope"));
    }
    if (this.scope === "COMBO" && (!this.comboItems || this.comboItems.length === 0)) {
        return next(new Error("comboItems is required for COMBO scope"));
    }
    next();
});

// Method to check if promotion is currently valid
PromotionSchema.methods.isValid = function() {
    const now = new Date();
    return this.isActive && now >= this.startDate && now <= this.endDate;
};

module.exports = mongoose.model("promotions", PromotionSchema);
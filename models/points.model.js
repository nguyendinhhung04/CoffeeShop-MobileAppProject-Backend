const mongoose = require("mongoose");

const pointsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" // Reference to User model
    },
    points: {
        type: Number,
        required: true,
        default: 0
    },
})

module.exports = mongoose.model("points", pointsSchema);
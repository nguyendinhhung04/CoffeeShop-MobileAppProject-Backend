const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users" // Reference to User model
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    isRead :{
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
    }
});

module.exports = mongoose.model("notifications", notificationsSchema);


const mongoose = require("mongoose");

const FcmTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User" // Reference to User model
  },
  deviceToken: {
    type: String,
    required: true
  }
});

FcmTokenSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("FcmToken", FcmTokenSchema);

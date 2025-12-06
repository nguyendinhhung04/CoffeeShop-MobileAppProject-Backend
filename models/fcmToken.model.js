const mongoose = require("mongoose");

const FcmTokenSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  deviceToken: String,
});

module.exports = mongoose.model("FcmToken", FcmTokenSchema);

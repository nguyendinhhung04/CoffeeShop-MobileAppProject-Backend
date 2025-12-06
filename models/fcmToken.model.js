const mongoose = require("mongoose");

const fcmToken = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  deviceToken: String,
});

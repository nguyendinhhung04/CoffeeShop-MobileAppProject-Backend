const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: String,
  phone: String,
  addresses: {
    street: String,
    ward: String,
    district: String,
    city: String,
    isDefault: Boolean,
  },
  role: String,
});

module.exports = mongoose.model("User", usersSchema);

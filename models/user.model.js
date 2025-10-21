const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: String,
    phone: String,
    role: { type: String, enum: ["admin","cashier","manager", "user"], default: "user" },
    device_token: String,
    studentCode: String
});

module.exports = mongoose.model("User", userSchema);
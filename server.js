const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/user.model");
const bcrypt = require("bcrypt");

dotenv.config();
const app = express();
app.use(express.json());

// --- Kết nối MongoDB ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// --- Route test ---
app.get("/", (req, res) => {
    res.send("Hello from Express + MongoDB!");
});

// --- API thêm user ---
app.post("/users", async (req, res) => {
    try {
        console.log(req.body);
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- API lấy danh sách user ---
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Route đăng ký user (tạo trước vài user để test) ---
app.post("/register", async (req, res) => {
    try {
        const { name, username, password, email, phone, role } = req.body;

        // Hash mật khẩu trước khi lưu
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            username,
            password: hashedPassword,
            email,
            phone,
            role,
        });

        res.status(201).json({ message: "✅ User registered", user: newUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- Route đăng nhập ---
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1️⃣ Kiểm tra có username trong DB không
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "❌ Username not found" });
        }

        // 2️⃣ So sánh mật khẩu nhập vào với mật khẩu đã hash trong DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "❌ Invalid password" });
        }

        // 3️⃣ Nếu đúng, trả thông tin user (ẩn password)
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json({ message: "✅ Login successful", user: userWithoutPassword });

    } catch (err) {
        res.status(500).json({ error: "Server error: " + err.message });
    }
});

// --- Chạy server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const express = require("express");
const router = express.Router();

const User = require("../models/users.model");

// --- Route test ---
router.get("/", (req, res) => {
    res.send("Hello from Express + MongoDB!");
});

// --- API thêm user ---
router.post("/users", async (req, res) => {
    try {
        console.log(req.body);
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- API lấy danh sách user ---
router.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Route đăng ký user (tạo trước vài user để test) ---
router.post("/register", async (req, res) => {
    try {
        const { name, username, password, email, phone, role } = req.body;

        const newUser = await User.create({
            name,
            username,
            password: password,
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
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1️⃣ Kiểm tra có username trong DB không
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "❌ Username not found" });
        }

        if (password != user.password) {
            return res.status(401).json({ error: "❌ Invalid password" });
        }

        // 3️⃣ Nếu đúng, trả thông tin user (ẩn password)
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json({ message: "✅ Login successful", user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ error: "Server error: " + err.message });
    }
});

router.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, phone, addresses, password } = req.body;

        // Chuẩn bị object update (không cho đổi username)
        const updateData = {
            fullName,
            email,
            phone,
            addresses
        };

        // Nếu có password mới, hash nó
        if (password) {
            updateData.password = password;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "❌ User not found" });
        }

        const { password: _, ...userWithoutPassword } = updatedUser.toObject();
        res.json({ message: "✅ User updated successfully", user: userWithoutPassword });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
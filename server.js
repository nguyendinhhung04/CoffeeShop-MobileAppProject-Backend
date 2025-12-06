const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/users.model");
const bcrypt = require("bcrypt");
const Item = require("./models/products.model");
const orderRoutes = require("./routes/orders.routes");
const notificationRoutes = require("./routes/notifications.routes");

dotenv.config();
const app = express();
app.use(express.json());

// --- Kết nối MongoDB ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

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

// // THÊM ĐOẠN NÀY VÀO server.js CỦA BẠN
// app.get("/items", async (req, res) => {
//   try {
//     const { category, search } = req.query;
//     let query = { isActive: true };

//     if (category && category !== "all") {
//       query.category = category;
//     }
//     if (search) {
//       query.name = { $regex: search, $options: "i" };
//     }

//     const items = await Item.find(query).select(
//       "name description basePrice image_url category sizes tempOptions toppings"
//     );
//     res.json(items);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Lấy toàn bộ danh sách món ăn
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find(); // không filter => lấy tất cả
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// Routes của order
app.use("/orders", orderRoutes);

//Routes của notifications
app.use("/fcm", notificationRoutes);

// Lấy toàn bộ danh sách món ăn
app.get("/testconnection", async (req, res) => {
  res.json("Hello");
});

// --- Chạy server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

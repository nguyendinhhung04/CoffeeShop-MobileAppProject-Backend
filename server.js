const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/users.model");
const bcrypt = require("bcrypt");
const Item = require("./models/products.model");

const orderRoutes = require("./routes/orders.routes");
const notificationRoutes = require("./routes/notifications.routes");
const userRoutes = require("./routes/users.routes");
const comboRoutes = require("./routes/combos.routes");
const itemRoutes = require("./routes/items.routes");
const favouriteRoutes = require("./routes/favorites.routes");

const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");

dotenv.config();
const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use(express.json());

// --- Kết nối MongoDB ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Route test ---
app.get("/", (req, res) => {
  // res.send("Hello from Express + MongoDB!");
  res.redirect("/api-docs");
});

// Routes của user
app.use("/", userRoutes);
// Routes của item
app.use("/items", itemRoutes);
// Routes của order
app.use("/orders", orderRoutes);
//Routes của notifications
app.use("/fcm", notificationRoutes);
//Routes của combos
app.use("/combos", comboRoutes);
// Routes của favourites
app.use("/favourites", favouriteRoutes);

// Test connection route
app.get("/testconnection", async (req, res) => {
  res.json("Hello");
});

// --- Chạy server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const express = require("express");
const notiRouter = express.Router();
const FcmToken = require("../models/fcmToken.model");



notiRouter.post("/savetoken", async (req, res) => {
  try {
    const { userId, deviceToken } = req.body;

    // Sử dụng findOneAndUpdate với upsert: true
    const fcmToken = await FcmToken.findOneAndUpdate(
      { userId: userId }, // Điều kiện tìm kiếm (đổi từ _id sang userId nếu field của bạn là userId)
      { deviceToken: deviceToken }, // Dữ liệu cập nhật
      {
        new: true, // Trả về document sau khi update
        upsert: true, // Tạo mới nếu không tìm thấy
        runValidators: true, // Chạy validation
      }
    );

    res.status(200).json({
      message: "Token saved successfully",
      fcmToken,
    });
  } catch (err) {
    console.error("Error saving token:", err);
    res.status(400).json({ error: err.message });
  }
});

notiRouter.get("/", async (req, res) => {
  res.json("Default notificationRoutes");
});

module.exports = notiRouter;

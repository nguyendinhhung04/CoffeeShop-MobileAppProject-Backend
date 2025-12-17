const express = require("express");
const notiRouter = express.Router();
const FcmToken = require("../models/fcmToken.model");
const admin = require("../config/firebase");

const Notification = require("../models/notifications.model");
const NotiUtils = require("../utils/notifications.utils");

notiRouter.post("/savetoken", async (req, res) => {
  try {
    const { userId, deviceToken } = req.body;

    // Validate input
    if (!userId || !deviceToken) {
      return res.status(400).json({
        error: "userId and deviceToken are required"
      });
    }

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

notiRouter.post("/test", async (req, res) => {

  const { token, title, body } = req.body;

  // Validate input
  if (!token || !title || !body) {
    return res.status(400).json({
      error: "token, title, and body are required"
    });
  }

  const message = {
    notification: { title, body },
    token: token
  };

  try {
    await admin.messaging().send(message);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

notiRouter.get("/user/:id", async (req, res) => {

  try {
    //find all notifications by userId
    const notifications = await Notification.find({ userId: req.params.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

notiRouter.post("/sendAllClient", async (req, res) => {

  try{
    const { title, body } = req.body;
    await NotiUtils.sendNotificationToAllClient(title, body);
    res.json({ success: true });
  }
  catch(err)
  {
    return res.status(500).json({ error: err.message });
  }

})


module.exports = notiRouter;

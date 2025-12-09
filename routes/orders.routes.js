const admin = require("../config/firebase.js");
const express = require("express");
const router = express.Router();
const Order = require("../models/orders.model");
const FcmToken = require("../models/fcmToken.model");
const NotiUtils = require("../utils/notifications.utils");

// --- Tạo đơn ---
router.post("/", async (req, res) => {
  try {
    const order = await Order.create(req.body);

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Hủy đơn (cập nhật trạng thái thành Cancelled) ---
router.delete("/usercancell/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: "Cancelled" },
        { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Xác nhận đơn (cập nhật trạng thái thành Confirmed) ---
router.post("/userconfirm/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: "Confirmed" },
        { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      message: "Order confirmed successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Cập nhật thông tin đơn ---
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- Đổi trạng thái đơn ---
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "Pending",
      "Unpaid", //Chưa dùng
      "Confirmed",
      "Delivering",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Send notification
    try {
      const fcmTokens = await FcmToken.find({ userId: order.userId });

      if (!fcmTokens || fcmTokens.length === 0) {
        console.log("No FCM tokens found for user");
        return res.json({
          message: "Order status updated successfully (no notification sent - no tokens)",
          order,
        });
      }

      // // Send notification to each device
      // const notifications = fcmTokens.map(async (tokenDoc) => {
      //   try {
      //     const message = {
      //       notification: {
      //         title: "Order Status Update",
      //         body: `Your order status has been updated to ${status}`
      //       },
      //       token: tokenDoc.deviceToken,
      //     };
      //     return await admin.messaging().send(message);
      //   } catch (error) {
      //     console.error(`Failed to send notification to token ${tokenDoc.deviceToken}:`, error);
      //     return null;
      //   }
      // });

      const notifications = await NotiUtils.saveNotification( order.userId ,
          "Order Status Update",
          `Your order status has been updated to ${status}`
      )

      if (!notifications){
        return res.json(
            {
                message: "Order status updated successfully (notification save failed)",
                order,
            }
        )
      }

      await NotiUtils.sendNotification( notifications.userId, notifications.title, notifications.body );
      console.log(notifications);

      // await Promise.all(notifications);

      return res.json({
        message: "Order status updated and notifications sent successfully",
        order,
      });
    } catch (notificationError) {
      console.error("Notification error:", notificationError);
      return res.json({
        message: "Order status updated successfully (notification failed)",
        order,
        notificationError: notificationError.message
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Lấy danh sách đơn ---
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Lấy danh sách đơn theo userId và status (hỗ trợ not equal) ---
router.get("/filter", async (req, res) => {
  try {
    const { userId, status, status_ne } = req.query;

    let query = {};

    if (userId) {
      query.userId = userId;
    }

    if (status) {
      query.status = status;
    }

    if (status_ne) {
      query.status = { $ne: status_ne };
    }

    const orders = await Order.find(query);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Lấy đơn theo ID ---
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
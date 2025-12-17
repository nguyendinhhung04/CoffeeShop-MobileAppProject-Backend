const Notification = require("../models/notifications.model");
const FcmToken = require("../models/fcmToken.model");
const admin = require("../config/firebase.js");

const saveNotification = async (userId, title, body) => {
    try {
        const notification = await Notification.create({
            userId,
            title,
            body,
            createdAt: new Date()
        });

        console.log(`Notification saved for user ${userId}:`, notification._id);
        return notification;
    } catch (error) {
        console.error("Error saving notification:", error);
        throw error;
    }
};

const saveNotifications = async (notifications) => {
    try {
        const result = await Notification.insertMany(notifications);
        console.log(`${result.length} notifications saved`);
        return result;
    } catch (error) {
        console.error("Error saving notifications:", error);
        throw error;
    }
};

const sendNotification = async (userId, title, body) => {
    // Send notification
    try {
        const fcmTokens = await FcmToken.find({userId: userId});

        if (!fcmTokens || fcmTokens.length === 0) {
            console.log("No FCM tokens found for user");
            return null;
        }

        console.log("FCM tokens found:", fcmTokens);

        // Send notification to each device
        const notifications = fcmTokens.map(async (tokenDoc) => {
            try {
                const message = {
                    notification: {
                        title: title,
                        body: body
                    },
                    token: tokenDoc.deviceToken,
                };
                return await admin.messaging().send(message);
            } catch (error) {
                console.error(`Failed to send notification to token ${tokenDoc.deviceToken}:`, error);
                return null;
            }
        });
    }
    catch (error) {
        console.error("Notification error:", error);
        return null;
    }
}

const sendNotificationToAllClient = async (title, body) => {
    try {
        // Lấy toàn bộ FCM token
        const fcmTokens = await FcmToken.find({});

        if (!fcmTokens || fcmTokens.length === 0) {
            console.log("No FCM tokens found");
            return null;
        }

        const tokens = fcmTokens.map(t => t.deviceToken);

        const message = {
            notification: {
                title: title,
                body: body
            },
            tokens: tokens
        };

        const response = await admin.messaging().sendEachForMulticast(message);

        console.log(`Notification sent to ${response.successCount} devices`);
        if (response.failureCount > 0) {
            console.log("Failed tokens:", response.responses
                .map((res, idx) => !res.success ? tokens[idx] : null)
                .filter(Boolean)
            );
        }

        return response;
    } catch (error) {
        console.error("Send notification to all clients error:", error);
        return null;
    }
};



module.exports = {
    saveNotification,
    saveNotifications,
    sendNotification,
    sendNotificationToAllClient
};
const Point = require('../models/points.model');

const updatePoints = async (userId, billAmount) => {
    const pointPerVND = 10000;
    const pointsToAdd = Math.floor(billAmount/pointPerVND);

    try {
        let userPoints = await Point.findOne({ userId });

        if (userPoints) {
            // Update existing points
            userPoints.points += pointsToAdd;
            await userPoints.save();
        } else {
            // Create new points record
            userPoints = new Point({ userId, points: pointsToAdd });
            await userPoints.save();
        }

        return userPoints.points;
    } catch (error) {
        throw new Error('Error updating points: ' + error.message);
    }
}

const discountWithPoint = async (userId, pointsToUse) => {
    const pointPerVND = 10000;

    try {
        let userPoints = await Point.findOne({ userId });

        if (!userPoints || userPoints.points < pointsToUse) {
            throw new Error('Insufficient points');
        }

        // Deduct points
        userPoints.points -= pointsToUse;
        await userPoints.save();

        return pointsToUse * pointPerVND;
    } catch (error) {
        throw new Error('Error applying discount with points: ' + error.message);
    }
}

const refundPoints = async (userId, pointsToRefund) => {
    try {
        let userPoints = await Point.findOne({ userId });

        if (userPoints) {
            // Update existing points
            userPoints.points += pointsToRefund;
            await userPoints.save();
        }

        return userPoints.points;
    } catch (error) {
        throw new Error('Error refunding points: ' + error.message);
    }
}

module.exports = {
    updatePoints,
    discountWithPoint,
    refundPoints
};
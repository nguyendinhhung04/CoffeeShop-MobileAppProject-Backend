const Point = require('../models/points.model');

const updatePoints = async (userId, billAmount) => {
    const pointPerVND = 10000;
    const pointsToAdd = Math.floor(billAmount/pointPerVND);

    try {
        let userPoints = await Point.findOne({ userId });

        if(!userPoints) {
            await createPointRecordIfNotExists(userId);
        }

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

        if(!userPoints) {
            await createPointRecordIfNotExists(userId);
        }

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
        if (!userPoints) {
            // Create new points record if not exists
            await createPointRecordIfNotExists(userId);
        }
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

//create point record ìf not exists
const createPointRecordIfNotExists = async (userId) => {
    try {
        let userPoints = await Point.findOne({ userId });

        if (!userPoints) {
            // Create new points record
            userPoints = new Point({ userId, points: 0 });
            await userPoints.save();
        }

        return userPoints;
    } catch (error) {
        throw new Error('Error creating point record: ' + error.message);
    }
}

module.exports = {
    updatePoints,
    discountWithPoint,
    refundPoints,
    createPointRecordIfNotExists
};
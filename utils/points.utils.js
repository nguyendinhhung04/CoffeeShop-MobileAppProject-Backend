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

module.exports = {
    updatePoints,
};
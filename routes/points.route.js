const express = require("express");
const router = express.Router();

const Point = require("../models/points.model");

// --- Get point by userId ---
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const pointRecord = await Point.findOne({ userId }) || 0;
        if (!pointRecord) {
            return res.status(404).json({ pointRecord });
        }

        res.json(pointRecord);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// export the router
module.exports = router;
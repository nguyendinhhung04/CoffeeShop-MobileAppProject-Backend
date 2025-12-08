const express = require("express");
const router = express.Router();

const Favorite = require("../models/favorites.model");

// --- API: add favorite ---
router.post("/", async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        if (!userId || !itemId) {
            return res.status(400).json({ error: "userId and itemId are required" });
        }

        // map itemId to productId used in schema
        const productId = itemId;

        // prevent duplicates
        const exists = await Favorite.findOne({ userId, productId });
        if (exists) {
            return res.status(409).json({ error: "Favorite already exists" });
        }

        const newFav = await Favorite.create({ userId, productId });
        res.status(201).json(newFav);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- API: remove favorite by userId + itemId ---
router.delete("/", async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        if (!userId || !itemId) {
            return res.status(400).json({ error: "userId and itemId are required" });
        }

        const productId = itemId;

        const deleted = await Favorite.findOneAndDelete({ userId, productId });
        if (!deleted) {
            return res.status(404).json({ error: "Favorite not found" });
        }

        res.json({ message: "Favorite removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- API: remove favorite by favorite ObjectId (use Favorite only) ---
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const fav = await Favorite.findById(id);
        if (!fav) {
            return res.status(404).json({ error: "Favorite not found" });
        }

        await fav.deleteOne();
        res.json({ message: "Favorite removed successfully" });
    } catch (err) {
        if (err && err.name === "CastError") {
            return res.status(400).json({ error: "Invalid favorite id" });
        }
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;


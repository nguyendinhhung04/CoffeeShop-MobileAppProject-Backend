const express = require("express");
const router = express.Router();
const Combo = require("../models/combos.model");

// --- GET all combos ---
router.get("/", async (req, res) => {
    try {
        const combos = await Combo.find();
        res.json(combos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- GET combo by ID ---
router.get("/:id", async (req, res) => {
    try {
        const combo = await Combo.findById(req.params.id);
        if (!combo) return res.status(404).json({ error: "Combo not found" });
        res.json(combo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CREATE new combo ---
router.post("/", async (req, res) => {
    try {
        const { name, description, category, basePrice, image_url, discount, items } = req.body;

        // Validate required fields
        if (!name || !basePrice) {
            return res.status(400).json({ error: "Name and basePrice are required" });
        }

        const discountedPrice = discount ? Math.round(basePrice * (1 - discount / 100)) : basePrice;

        const newCombo = await Combo.create({
            _id: new Date().getTime().toString(),
            name,
            description,
            category,
            basePrice,
            image_url,
            discount: discount || 0,
            discountedPrice,
            items: items || [],
            isActive: true,
        });

        res.status(201).json(newCombo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- UPDATE combo ---
router.put("/:id", async (req, res) => {
    try {
        const { name, description, category, basePrice, image_url, discount, items, isActive } = req.body;

        const discountedPrice = discount ? Math.round(basePrice * (1 - discount / 100)) : basePrice;

        const updatedCombo = await Combo.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                category,
                basePrice,
                image_url,
                discount: discount || 0,
                discountedPrice,
                items: items || [],
                isActive,
                updatedAt: new Date(),
            },
            { new: true }
        );

        if (!updatedCombo) return res.status(404).json({ error: "Combo not found" });
        res.json(updatedCombo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- DELETE combo ---
router.delete("/:id", async (req, res) => {
    try {
        const deletedCombo = await Combo.findByIdAndDelete(req.params.id);
        if (!deletedCombo) return res.status(404).json({ error: "Combo not found" });
        res.json({ message: "Combo deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
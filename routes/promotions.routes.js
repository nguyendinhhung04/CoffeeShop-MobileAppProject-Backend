const express = require("express");
const router = express.Router();

const Promotion = require("../models/promotions.model");

// --- Helper function: Validate promotion uniqueness ---
const validatePromotion = async (scope, productIds, categories, comboItems, excludePromotionId = null) => {
    const errors = [];

    // Build base query to exclude current promotion (for updates)
    const baseQuery = excludePromotionId ? { _id: { $ne: excludePromotionId } } : {};

    if (scope === "PRODUCT" && productIds && productIds.length > 0) {
        // Check if any productId already has a promotion
        for (const productId of productIds) {
            const existing = await Promotion.findOne({
                ...baseQuery,
                scope: "PRODUCT",
                productIds: productId
            });

            if (existing) {
                errors.push(`Product ${productId} already has an active promotion (ID: ${existing._id}). Please update the existing promotion instead.`);
            }
        }
    }

    if (scope === "CATEGORY" && categories && categories.length > 0) {
        // Check if any category already has a promotion
        for (const category of categories) {
            const existing = await Promotion.findOne({
                ...baseQuery,
                scope: "CATEGORY",
                categories: category
            });

            if (existing) {
                errors.push(`Category "${category}" already has an active promotion (ID: ${existing._id}). Please update the existing promotion instead.`);
            }
        }
    }

    if (scope === "COMBO" && comboItems && comboItems.length > 0) {
        // Sort comboItems for consistent comparison
        const sortedComboItems = [...comboItems].sort((a, b) =>
            a.productId.toString().localeCompare(b.productId.toString())
        );

        // Find all existing combo promotions
        const existingCombos = await Promotion.find({
            ...baseQuery,
            scope: "COMBO"
        });

        // Check if the same combo already exists
        for (const existingCombo of existingCombos) {
            const existingSorted = [...existingCombo.comboItems].sort((a, b) =>
                a.productId.toString().localeCompare(b.productId.toString())
            );

            // Compare if combo items match
            if (existingSorted.length === sortedComboItems.length) {
                const isMatch = existingSorted.every((item, index) => {
                    const sortedItem = sortedComboItems[index];
                    return item.productId.toString() === sortedItem.productId.toString()
                        && item.requiredQty === sortedItem.requiredQty;
                });

                if (isMatch) {
                    errors.push(`This combo already exists in promotion (ID: ${existingCombo._id}). Please update the existing promotion instead.`);
                    break;
                }
            }
        }
    }

    return errors;
};

// --- API: Get all promotions ---
router.get("/", async (req, res) => {
    try {
        const { isActive, scope, type } = req.query;

        // Build filter object
        const filter = {};
        if (isActive !== undefined) {
            filter.isActive = isActive === "true";
        }
        if (scope) {
            filter.scope = scope;
        }
        if (type) {
            filter.type = type;
        }

        const promotions = await Promotion.find(filter)
            .sort({ createdAt: -1 });

        res.json(promotions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- API: Get active promotions (currently valid) ---
router.get("/active", async (req, res) => {
    try {
        const now = new Date();

        const promotions = await Promotion.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        }).sort({ startDate: -1 });

        res.json(promotions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- API: Get promotion by ID ---
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const promotion = await Promotion.findById(id);

        if (!promotion) {
            return res.status(404).json({ error: "Promotion not found" });
        }

        res.json(promotion);
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ error: "Invalid promotion ID" });
        }
        res.status(500).json({ error: err.message });
    }
});

// --- API: Create new promotion ---
router.post("/", async (req, res) => {
    try {
        const {
            name,
            description,
            type,
            scope,
            value,
            startDate,
            endDate,
            minOrderTotal,
            isActive,
            productIds,
            categories,
            comboItems
        } = req.body;

        // Validation
        if (!name || !type || !scope || value === undefined || !startDate || !endDate) {
            return res.status(400).json({
                error: "Missing required fields: name, type, scope, value, startDate, endDate"
            });
        }

        // Validate type enum
        if (!["PERCENT", "FIXED_AMOUNT", "FIXED_PRICE_COMBO"].includes(type)) {
            return res.status(400).json({
                error: "Invalid type. Must be PERCENT, FIXED_AMOUNT, or FIXED_PRICE_COMBO"
            });
        }

        // Validate scope enum
        if (!["ORDER", "PRODUCT", "CATEGORY", "COMBO"].includes(scope)) {
            return res.status(400).json({
                error: "Invalid scope. Must be ORDER, PRODUCT, CATEGORY, or COMBO"
            });
        }

        // Validate scope-specific fields
        if (scope === "PRODUCT" && (!productIds || productIds.length === 0)) {
            return res.status(400).json({
                error: "productIds is required for PRODUCT scope"
            });
        }

        if (scope === "CATEGORY" && (!categories || categories.length === 0)) {
            return res.status(400).json({
                error: "categories is required for CATEGORY scope"
            });
        }

        if (scope === "COMBO" && (!comboItems || comboItems.length === 0)) {
            return res.status(400).json({
                error: "comboItems is required for COMBO scope"
            });
        }

        // *** VALIDATE UNIQUENESS ***
        const validationErrors = await validatePromotion(scope, productIds, categories, comboItems);
        if (validationErrors.length > 0) {
            return res.status(409).json({
                error: "Promotion validation failed",
                details: validationErrors
            });
        }

        const promotionData = {
            name,
            description,
            type,
            scope,
            value,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            minOrderTotal,
            isActive: isActive !== undefined ? isActive : true
        };

        // Add scope-specific fields
        if (scope === "PRODUCT") promotionData.productIds = productIds;
        if (scope === "CATEGORY") promotionData.categories = categories;
        if (scope === "COMBO") promotionData.comboItems = comboItems;

        const promotion = await Promotion.create(promotionData);

        res.status(201).json(promotion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- API: Update promotion ---
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            type,
            scope,
            value,
            startDate,
            endDate,
            minOrderTotal,
            isActive,
            productIds,
            categories,
            comboItems
        } = req.body;

        const promotion = await Promotion.findById(id);

        if (!promotion) {
            return res.status(404).json({ error: "Promotion not found" });
        }

        // Determine the scope to validate (use new scope if provided, otherwise keep existing)
        const scopeToValidate = scope !== undefined ? scope : promotion.scope;
        const productIdsToValidate = productIds !== undefined ? productIds : promotion.productIds;
        const categoriesToValidate = categories !== undefined ? categories : promotion.categories;
        const comboItemsToValidate = comboItems !== undefined ? comboItems : promotion.comboItems;

        // *** VALIDATE UNIQUENESS (excluding current promotion) ***
        const validationErrors = await validatePromotion(
            scopeToValidate,
            productIdsToValidate,
            categoriesToValidate,
            comboItemsToValidate,
            id  // Exclude current promotion from validation
        );

        if (validationErrors.length > 0) {
            return res.status(409).json({
                error: "Promotion validation failed",
                details: validationErrors
            });
        }

        // Update fields if provided
        if (name !== undefined) promotion.name = name;
        if (description !== undefined) promotion.description = description;
        if (type !== undefined) {
            if (!["PERCENT", "FIXED_AMOUNT", "FIXED_PRICE_COMBO"].includes(type)) {
                return res.status(400).json({
                    error: "Invalid type. Must be PERCENT, FIXED_AMOUNT, or FIXED_PRICE_COMBO"
                });
            }
            promotion.type = type;
        }
        if (scope !== undefined) {
            if (!["ORDER", "PRODUCT", "CATEGORY", "COMBO"].includes(scope)) {
                return res.status(400).json({
                    error: "Invalid scope. Must be ORDER, PRODUCT, CATEGORY, or COMBO"
                });
            }
            promotion.scope = scope;
        }
        if (value !== undefined) promotion.value = value;
        if (startDate !== undefined) promotion.startDate = new Date(startDate);
        if (endDate !== undefined) promotion.endDate = new Date(endDate);
        if (minOrderTotal !== undefined) promotion.minOrderTotal = minOrderTotal;
        if (isActive !== undefined) promotion.isActive = isActive;

        // Update scope-specific fields
        if (productIds !== undefined) promotion.productIds = productIds;
        if (categories !== undefined) promotion.categories = categories;
        if (comboItems !== undefined) promotion.comboItems = comboItems;

        await promotion.save();

        res.json(promotion);
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ error: "Invalid promotion ID" });
        }
        res.status(500).json({ error: err.message });
    }
});


// --- API: Delete promotion ---
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const promotion = await Promotion.findById(id);

        if (!promotion) {
            return res.status(404).json({ error: "Promotion not found" });
        }

        await promotion.deleteOne();

        res.json({ message: "Promotion deleted successfully" });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ error: "Invalid promotion ID" });
        }
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
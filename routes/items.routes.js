const express = require("express");
const router = express.Router();

const Item = require("../models/products.model.js");

router.get("/", async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = { isActive: true };

        if (category && category !== "all") {
            query.category = category;
        }
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const items = await Item.find(query).select(
            "name description basePrice image_url category sizes tempOptions toppings"
        );
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/top-selling", async (req, res) => {
    try {
        const topItems = await Item.aggregate([
            {
                $match: {
                    status: { $in: ["Confirmed", "Delivering", "Delivered"] }
                }
            },
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: "$items.itemId",
                    totalQuantity: { $sum: "$items.quantity" }
                }
            },
            {
                $sort: { totalQuantity: -1 }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: "items",
                    localField: "_id",
                    foreignField: "_id",
                    as: "itemDetails"
                }
            },
            {
                $unwind: "$itemDetails"
            },
            {
                $project: {
                    _id: 1,
                    totalQuantity: 1,
                    name: "$itemDetails.name",
                    basePrice: "$itemDetails.basePrice",
                    image_url: "$itemDetails.image_url",
                    category: "$itemDetails.category"
                }
            }
        ]);

        res.json(topItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
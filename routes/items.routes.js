const express = require("express");
const router = express.Router();

const Item = require("../models/products.model.js");
const Order = require("../models/orders.model.js");

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
        const statuses = ["Confirmed", "Delivering", "Delivered"];

        const result = await Order.aggregate([
            // Chỉ lấy đơn hàng có status hợp lệ
            { $match: { status: { $in: statuses } } },

            // Tách từng item trong đơn
            { $unwind: "$items" },

            // Gom nhóm theo productId và cộng dồn quantity
            {
                $group: {
                    _id: "$items.productId",
                    totalSold: { $sum: "$items.quantity" }
                }
            },

            // Join sang bảng products
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },

            // Lấy product object (không phải array)
            { $unwind: "$product" },

            // Sắp xếp theo số lượng bán giảm dần
            { $sort: { totalSold: -1 } },

            // Chỉ lấy 10 sản phẩm đầu tiên
            { $limit: 10 },

            // Format dữ liệu trả về
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    name: "$product.name",
                    image_url: "$product.image_url",
                    totalSold: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Top 10 best-selling products",
            data: result
        });

    } catch (error) {
        console.error("Error getting top-selling products:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});


module.exports = router;
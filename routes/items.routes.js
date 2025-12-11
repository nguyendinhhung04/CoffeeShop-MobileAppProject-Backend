const express = require("express");
const router = express.Router();

const Item = require("../models/products.model.js");
const Order = require("../models/orders.model.js");
const Promotion = require("../models/promotions.model.js");

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

        // Lấy tất cả promotions đang active
        const now = new Date();
        const activePromotions = await Promotion.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        });

        // Thêm thông tin promotion vào từng sản phẩm
        const itemsWithPromotions = items.map(item => {
            const itemObj = item.toObject();
            let promotion = null;

            // Tìm promotion cho sản phẩm này
            // 1. Kiểm tra promotion theo PRODUCT scope
            const productPromo = activePromotions.find(p =>
                p.scope === "PRODUCT" &&
                p.productIds.some(id => id.toString() === item._id.toString())
            );

            // 2. Kiểm tra promotion theo CATEGORY scope
            const categoryPromo = activePromotions.find(p =>
                p.scope === "CATEGORY" &&
                p.categories.includes(item.category)
            );

            // Ưu tiên promotion theo sản phẩm trước
            if (productPromo) {
                promotion = {
                    _id: productPromo._id,
                    name: productPromo.name,
                    description: productPromo.description,
                    type: productPromo.type,
                    scope: productPromo.scope,
                    value: productPromo.value,
                    startDate: productPromo.startDate,
                    endDate: productPromo.endDate
                };
            } else if (categoryPromo) {
                promotion = {
                    _id: categoryPromo._id,
                    name: categoryPromo.name,
                    description: categoryPromo.description,
                    type: categoryPromo.type,
                    scope: categoryPromo.scope,
                    value: categoryPromo.value,
                    startDate: categoryPromo.startDate,
                    endDate: categoryPromo.endDate
                };
            }

            // Tính giá sau giảm nếu có promotion
            if (promotion) {
                let discountedPrice = itemObj.basePrice;

                if (promotion.type === "PERCENT") {
                    discountedPrice = itemObj.basePrice * (1 - promotion.value / 100);
                } else if (promotion.type === "FIXED_AMOUNT") {
                    discountedPrice = Math.max(0, itemObj.basePrice - promotion.value);
                }

                itemObj.promotion = promotion;
                itemObj.discountedPrice = Math.round(discountedPrice);
            }

            return itemObj;
        });

        res.json(itemsWithPromotions);
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
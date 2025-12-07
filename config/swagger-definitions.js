// javascript
const swaggerDefinitions = {
    "/orders": {
        post: {
            summary: "Create a new order",
            tags: ["Orders"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                userId: { type: "string" },
                                orderDate: { type: "string", format: "date-time" },
                                status: { type: "string" },
                                paymentMethod: { type: "string" },
                                note: { type: "string" },
                                subtotal: { type: "number" },
                                discountAmount: { type: "number" },
                                shippingFee: { type: "number" },
                                taxes: { type: "number" },
                                totalAmount: { type: "number" },
                                deliveryAddress: { type: "object" },
                                items: { type: "array" }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: "Order created successfully" },
                400: { description: "Bad request" }
            }
        },
        get: {
            summary: "Get all orders",
            tags: ["Orders"],
            responses: {
                200: { description: "List of all orders" }
            }
        }
    },
    "/orders/filter": {
        get: {
            summary: "Filter orders by userId, status, or status_ne",
            tags: ["Orders"],
            parameters: [
                {
                    in: "query",
                    name: "userId",
                    schema: { type: "string" },
                    description: "Filter by user ID"
                },
                {
                    in: "query",
                    name: "status",
                    schema: { type: "string" },
                    description: "Filter by exact status"
                },
                {
                    in: "query",
                    name: "status_ne",
                    schema: { type: "string" },
                    description: "Filter by status NOT equal to"
                }
            ],
            responses: {
                200: { description: "Filtered orders" }
            }
        }
    },
    "/orders/{id}": {
        get: {
            summary: "Get order by ID",
            tags: ["Orders"],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: { description: "Order details" },
                404: { description: "Order not found" }
            }
        },
        put: {
            summary: "Update order information",
            tags: ["Orders"],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                status: { type: "string" },
                                note: { type: "string" },
                                paymentMethod: { type: "string" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Order updated successfully" },
                404: { description: "Order not found" }
            }
        },
        delete: {
            summary: "Cancel order (set status to Cancelled)",
            tags: ["Orders"],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: { description: "Order cancelled successfully" },
                404: { description: "Order not found" }
            }
        },
        post: {
            summary: "Confirm order (set status to Confirmed)",
            tags: ["Orders"],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: { description: "Order confirmed successfully" },
                404: { description: "Order not found" }
            }
        }
    },
    "/orders/{id}/status": {
        patch: {
            summary: "Update order status and send FCM notification",
            tags: ["Orders"],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                status: {
                                    type: "string",
                                    enum: ["Pending", "Unpaid", "Confirmed", "Delivering", "Delivered", "Cancelled"]
                                }
                            },
                            required: ["status"]
                        }
                    }
                }
            },
            responses: {
                200: { description: "Status updated and notifications sent successfully" },
                400: { description: "Invalid order status" },
                404: { description: "Order not found" }
            }
        }
    }
};

module.exports = swaggerDefinitions;
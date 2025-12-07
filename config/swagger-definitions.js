// javascript
const swaggerDefinitions = {
    // ============== ORDERS ROUTES ==============
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
                200: { description: "List of all orders" },
                500: { description: "Server error" }
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
                200: { description: "Filtered orders" },
                500: { description: "Server error" }
            }
        }
    },
    "/orders/usercancell/{id}": {
        delete: {
            summary: "User cancel order (set status to Cancelled)",
            tags: ["Orders"],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "string" },
                    description: "Order ID"
                }
            ],
            responses: {
                200: { description: "Order cancelled successfully" },
                404: { description: "Order not found" },
                500: { description: "Server error" }
            }
        }
    },
    "/orders/userconfirm/{id}": {
        post: {
            summary: "User confirm order (set status to Confirmed)",
            tags: ["Orders"],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "string" },
                    description: "Order ID"
                }
            ],
            responses: {
                200: { description: "Order confirmed successfully" },
                404: { description: "Order not found" },
                500: { description: "Server error" }
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
                    schema: { type: "string" },
                    description: "Order ID"
                }
            ],
            responses: {
                200: { description: "Order details" },
                404: { description: "Order not found" },
                500: { description: "Server error" }
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
                    schema: { type: "string" },
                    description: "Order ID"
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
                                paymentMethod: { type: "string" },
                                subtotal: { type: "number" },
                                discountAmount: { type: "number" },
                                shippingFee: { type: "number" },
                                taxes: { type: "number" },
                                totalAmount: { type: "number" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Order updated successfully" },
                404: { description: "Order not found" },
                500: { description: "Server error" }
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
                    schema: { type: "string" },
                    description: "Order ID"
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
                404: { description: "Order not found" },
                500: { description: "Server error" }
            }
        }
    },

    // ============== USERS ROUTES ==============
    "/users": {
        post: {
            summary: "Create a new user",
            tags: ["Users"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                username: { type: "string" },
                                password: { type: "string" },
                                email: { type: "string", format: "email" },
                                phone: { type: "string" },
                                role: { type: "string" }
                            },
                            required: ["username", "password"]
                        }
                    }
                }
            },
            responses: {
                201: { description: "User created successfully" },
                400: { description: "Bad request" }
            }
        },
        get: {
            summary: "Get all users",
            tags: ["Users"],
            responses: {
                200: { description: "List of all users" },
                500: { description: "Server error" }
            }
        }
    },
    "/register": {
        post: {
            summary: "Register a new user with hashed password",
            tags: ["Authentication"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                username: { type: "string" },
                                password: { type: "string" },
                                email: { type: "string", format: "email" },
                                phone: { type: "string" },
                                role: { type: "string" }
                            },
                            required: ["username", "password"]
                        }
                    }
                }
            },
            responses: {
                201: { description: "User registered successfully" },
                400: { description: "Bad request" }
            }
        }
    },
    "/login": {
        post: {
            summary: "Login user",
            tags: ["Authentication"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                username: { type: "string" },
                                password: { type: "string" }
                            },
                            required: ["username", "password"]
                        }
                    }
                }
            },
            responses: {
                200: { description: "Login successful" },
                401: { description: "Invalid password" },
                404: { description: "Username not found" },
                500: { description: "Server error" }
            }
        }
    },

    // ============== ITEMS/PRODUCTS ROUTES ==============
    "/items": {
        get: {
            summary: "Get all active items/products with optional filters",
            tags: ["Items"],
            parameters: [
                {
                    in: "query",
                    name: "category",
                    schema: { type: "string" },
                    description: "Filter by category (use 'all' for all categories)"
                },
                {
                    in: "query",
                    name: "search",
                    schema: { type: "string" },
                    description: "Search by item name (case-insensitive)"
                }
            ],
            responses: {
                200: {
                    description: "List of items",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string" },
                                        description: { type: "string" },
                                        basePrice: { type: "number" },
                                        image_url: { type: "string" },
                                        category: { type: "string" },
                                        sizes: { type: "array" },
                                        tempOptions: { type: "array" },
                                        toppings: { type: "array" }
                                    }
                                }
                            }
                        }
                    }
                },
                500: { description: "Server error" }
            }
        }
    },

    // ============== FCM NOTIFICATIONS ROUTES ==============
    "/fcm": {
        get: {
            summary: "Default notification route",
            tags: ["Notifications"],
            responses: {
                200: { description: "Default notification response" }
            }
        }
    },
    "/fcm/savetoken": {
        post: {
            summary: "Save or update FCM device token for a user",
            tags: ["Notifications"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                userId: { type: "string" },
                                deviceToken: { type: "string" }
                            },
                            required: ["userId", "deviceToken"]
                        }
                    }
                }
            },
            responses: {
                200: { description: "Token saved successfully" },
                400: { description: "Bad request - userId and deviceToken are required" }
            }
        }
    },
    "/fcm/test": {
        post: {
            summary: "Test FCM notification",
            tags: ["Notifications"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                token: {
                                    type: "string",
                                    description: "FCM device token"
                                },
                                title: {
                                    type: "string",
                                    description: "Notification title"
                                },
                                body: {
                                    type: "string",
                                    description: "Notification body/message"
                                }
                            },
                            required: ["token", "title", "body"]
                        }
                    }
                }
            },
            responses: {
                200: { description: "Notification sent successfully" },
                400: { description: "Bad request - token, title, and body are required" },
                500: { description: "Server error - failed to send notification" }
            }
        }
    },

    // ============== TEST ROUTES ==============
    "/": {
        get: {
            summary: "Test root endpoint",
            tags: ["Test"],
            responses: {
                200: { description: "Hello from Express + MongoDB!" }
            }
        }
    },
    "/testconnection": {
        get: {
            summary: "Test database connection",
            tags: ["Test"],
            responses: {
                200: { description: "Connection test response" }
            }
        }
    }
};

module.exports = swaggerDefinitions;
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
    "/users/{id}": {
        put: {
            summary: "Update user information (cannot change username)",
            tags: ["Users"],
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
                                name: { type: "string" },
                                email: { type: "string" },
                                phone: { type: "string" },
                                password: { type: "string", description: "New password (optional)" },
                                addresses: {
                                    type: "object",
                                    properties: {
                                        street: { type: "string" },
                                        ward: { type: "string" },
                                        district: { type: "string" },
                                        city: { type: "string" }
                                    }
                                },
                                role: { type: "string" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "User updated successfully" },
                404: { description: "User not found" }
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

    "/items/top-selling": {
        get: {
            summary: "Get top 10 best-selling items",
            tags: ["Items"],
            description: "Returns top 10 products sorted by total quantity sold in confirmed, delivering, and delivered orders",
            responses: {
                200: {
                    description: "Top 10 best-selling items",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        _id: { type: "string" },
                                        totalQuantity: { type: "number" },
                                        name: { type: "string" },
                                        basePrice: { type: "number" },
                                        image_url: { type: "string" },
                                        category: { type: "string" }
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
    },

    // ============== COMBOS ROUTES ==============
    "/combos": {
        get: {
            summary: "Get all combos",
            tags: ["Combos"],
            responses: {
                200: { description: "List of all combos" },
                500: { description: "Server error" }
            }
        },
        post: {
            summary: "Create a new combo",
            tags: ["Combos"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                description: { type: "string" },
                                category: { type: "string" },
                                basePrice: { type: "number" },
                                image_url: { type: "string" },
                                discount: { type: "number" },
                                items: { type: "array" }
                            },
                            required: ["name", "basePrice"]
                        }
                    }
                }
            },
            responses: {
                201: { description: "Combo created successfully" },
                400: { description: "Bad request" }
            }
        }
    },
    "/combos/{id}": {
        get: {
            summary: "Get combo by ID",
            tags: ["Combos"],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: { description: "Combo details" },
                404: { description: "Combo not found" },
                500: { description: "Server error" }
            }
        },
        put: {
            summary: "Update combo",
            tags: ["Combos"],
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
                                name: { type: "string" },
                                description: { type: "string" },
                                category: { type: "string" },
                                basePrice: { type: "number" },
                                image_url: { type: "string" },
                                discount: { type: "number" },
                                items: { type: "array" },
                                isActive: { type: "boolean" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Combo updated successfully" },
                404: { description: "Combo not found" }
            }
        },
        delete: {
            summary: "Delete combo",
            tags: ["Combos"],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: { description: "Combo deleted successfully" },
                404: { description: "Combo not found" },
                500: { description: "Server error" }
            }
        }
    }
};

module.exports = swaggerDefinitions;
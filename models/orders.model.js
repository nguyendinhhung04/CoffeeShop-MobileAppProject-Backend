// models/Order.js
const mongoose = require("mongoose");

const ToppingSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const ItemSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  productName: String,
  quantity: Number,
  finalUnitPrice: Number,
  sizeChosen: String,
  tempChosen: String,
  iceLevel: String,
  sugarLevel: String,
  chosenToppings: [ToppingSchema],
  itemNote: String,
});

const DeliverySchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  street: String,
  ward: String,
  district: String,
  city: String,
});

const OrderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  orderDate: { type: Date, default: Date.now },
  status: String,
  paymentMethod: String,
  note: String,

  subtotal: Number,
  discountAmount: Number,
  shippingFee: Number,
  taxes: Number,
  totalAmount: Number,

  deliveryAddress: DeliverySchema,
  items: [ItemSchema],
});

module.exports = mongoose.model("orders", OrderSchema);

const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  _id: String,
  name: String,
  description: String,
  category: String,
  basePrice: Number,
  image_url: String,

  sizes: [
    {
      name: String,
      modifier: Number,
      label: String,
    },
  ],

  tempOptions: [
    {
      name: String,
      modifier: Number,
      label: String,
    },
  ],

  iceLevels: [String],
  sugarLevels: [String],

  toppings: [
    {
      name: String,
      price: Number,
    },
  ],

  isActive: Boolean,
});

module.exports = mongoose.model("products", productsSchema);

const mongoose = require("mongoose");
const strOptions = { type: String, required: true };
const numberOptions = { type: Number, required: true, min: 0 };

const imageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});

const productSchema = new mongoose.Schema(
  {
    title: strOptions,
    price: numberOptions,
    description: strOptions,
    stock: numberOptions,
    images: [imageSchema],
    brand: strOptions,
    colors: [String],
    location: strOptions,
    coordinate: [Number],
    category: strOptions,
    subCategory: strOptions,
    rating: { type: Number, min: 0, default: 0 },
    stripeProductId: strOptions,
    stripePriceId: strOptions,
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    billingAddress: { type: Object, required: true },
    deliveryAddress: { type: Object, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    Product: {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      color: String,
      quantity: Number,
    },
    invoiceId: { type: String, required: true },
    paymentIntentId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    groupId: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "waitingConfirmation",
        "confirmed",
        "cancelRequest",
        "cancelled",
        "packing",
        "shipped",
        "delivered",
      ],
      default: "waitingConfirmation",
    },
    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);

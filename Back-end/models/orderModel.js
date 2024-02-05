import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  totalPrice: {
    type: mongoose.SchemaTypes.Decimal128,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Pending", "Canceled", "Accepted", "Delivered"],
    default: "Pending",
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number },
    },
  ],

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;

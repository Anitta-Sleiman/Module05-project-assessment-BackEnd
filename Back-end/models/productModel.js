const Schema = mongoose.Schema;
import mongoose from "mongoose";

const Products = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// module.exports = mongoose.model('Product', Products)
export default mongoose.model("Product", Products);

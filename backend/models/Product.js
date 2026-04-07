const mongoose = require("mongoose");
const reviewSchema = require("./Review");

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    images: [{ type: String }],
    brand: String,
    category: String,
    description: String,
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

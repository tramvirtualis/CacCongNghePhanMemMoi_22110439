const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  salePrice: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  imageUrls: { type: [String], default: [] },
  // keep backward compatibility with existing code reading single image
  image: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
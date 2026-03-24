const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: String },
  rating: { type: Number, default: 0 }, // Đảm bảo là Number
  poster: { type: String },
  backdrop: { type: String }, // PHẢI CÓ DÒNG NÀY THÌ COMPASS MỚI HIỆN
  overview: { type: String },
  createdAt: { type: Date, default: Date.now },
  tmdbId: { type: String },
});

module.exports = mongoose.model("Movie", MovieSchema);

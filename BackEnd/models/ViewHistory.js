const mongoose = require("mongoose");

const ViewHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Hỗ trợ 2 loại phim: phim backend (dùng movieId) và phim TMDB (dùng tmdbId)
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      default: null,
    },
    tmdbId: {
      type: String,
      default: null,
    },
    movieTitle: {
      type: String,
      required: true,
    },
    moviePoster: {
      type: String,
      default: "",
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: Number, // Tổng số giây đã xem
      default: 0,
    },
    progress: {
      type: Number, // Phần trăm đã xem (0-100)
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ViewHistory", ViewHistorySchema);

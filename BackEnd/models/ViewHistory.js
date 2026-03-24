const mongoose = require("mongoose");

const ViewHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  movieTitle: {
    type: String,
    required: true,
  },
  viewedAt: {
    type: Date,
    default: Date.now,
  },
  duration: {
    type: Number, // seconds viewed
    default: 0,
  },
});

module.exports = mongoose.model("ViewHistory", ViewHistorySchema);

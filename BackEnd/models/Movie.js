const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    year: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    poster: { type: String, default: "" },
    backdrop: { type: String, default: "" },
    overview: { type: String, default: "" },
    tmdbId: { type: String, default: null, index: true },
    actors: [{ type: String, trim: true }],
    genres: [{ type: String, trim: true }],
    cast: [
      {
        name: { type: String, trim: true },
        character: { type: String, trim: true },
        avatar: { type: String, trim: true },
      },
    ],
    releaseDate: { type: String, default: "" },
    runtime: { type: Number, default: null },
    totalEpisodes: { type: Number, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Movie", MovieSchema);

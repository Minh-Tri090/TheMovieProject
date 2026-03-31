const mongoose = require("mongoose");

function isMongoObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

function normalizeMoviePayload(payload) {
  const nextPayload = { ...payload };

  if (nextPayload.rating !== undefined && nextPayload.rating !== null) {
    const numericRating = Number(nextPayload.rating);
    nextPayload.rating = Number.isNaN(numericRating) ? 0 : numericRating;
  }

  if (Array.isArray(nextPayload.actors)) {
    nextPayload.actors = nextPayload.actors
      .map((actor) => String(actor).trim())
      .filter(Boolean);
  }

  if (Array.isArray(nextPayload.genres)) {
    nextPayload.genres = nextPayload.genres
      .map((genre) => String(genre).trim())
      .filter(Boolean);
  }

  if (nextPayload.runtime !== undefined && nextPayload.runtime !== null && nextPayload.runtime !== "") {
    const runtime = Number(nextPayload.runtime);
    nextPayload.runtime = Number.isNaN(runtime) ? null : runtime;
  }

  if (
    nextPayload.totalEpisodes !== undefined &&
    nextPayload.totalEpisodes !== null &&
    nextPayload.totalEpisodes !== ""
  ) {
    const totalEpisodes = Number(nextPayload.totalEpisodes);
    nextPayload.totalEpisodes = Number.isNaN(totalEpisodes) ? null : totalEpisodes;
  }

  return nextPayload;
}

module.exports = { isMongoObjectId, normalizeMoviePayload };

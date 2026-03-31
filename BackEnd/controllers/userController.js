const Movie = require("../models/Movie");
const User = require("../models/User");

const AppError = require("../utils/appError");
const { isMongoObjectId, normalizeMoviePayload } = require("../utils/movie");

async function toggleFavorite(req, res) {
  const { movieId } = req.params;
  const movieData = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const findConditions = [{ tmdbId: movieId }];
  if (isMongoObjectId(movieId)) {
    findConditions.push({ _id: movieId });
  }

  let movie = await Movie.findOne({ $or: findConditions });

  if (!movie && movieData.title) {
    movie = await Movie.create(normalizeMoviePayload({
      title: movieData.title,
      year: movieData.year,
      poster: movieData.poster,
      backdrop: movieData.backdrop,
      rating: movieData.rating,
      overview: movieData.overview,
      actors: movieData.actors,
      genres: movieData.genres,
      cast: movieData.cast,
      releaseDate: movieData.releaseDate,
      runtime: movieData.runtime,
      totalEpisodes: movieData.totalEpisodes,
      tmdbId: movieId,
    }));
  }

  if (!movie) {
    throw new AppError("Movie payload is required for new favorites", 400);
  }

  const targetId = movie._id.toString();
  const isFavorite = user.favorites.some(
    (favoriteId) => favoriteId.toString() === targetId,
  );

  if (isFavorite) {
    user.favorites = user.favorites.filter(
      (favoriteId) => favoriteId.toString() !== targetId,
    );
  } else {
    user.favorites.push(movie._id);
  }

  await user.save();
  res.json(user.favorites);
}

async function getFavorites(req, res) {
  const user = await User.findById(req.user.id).populate("favorites");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json(user.favorites);
}

module.exports = { toggleFavorite, getFavorites };

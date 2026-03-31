const Movie = require("../models/Movie");

const AppError = require("../utils/appError");
const { normalizeMoviePayload } = require("../utils/movie");

async function listMovies(req, res) {
  const { isKidsMode } = req.query;

  // Lọc phim cho chế độ trẻ em: chỉ Hoạt Hình, Gia Đình, hoặc Cổ Tích
  const query =
    isKidsMode === "true"
      ? {
          genres: {
            $in: [/^Hoạt\s+Hình$/i, /^Gia\s+Đình$/i, /^Cổ\s+Tích$/i],
          },
        }
      : {};

  const movies = await Movie.find(query).sort({ createdAt: -1 });
  res.json(movies);
}

async function createMovie(req, res) {
  const movie = await Movie.create(normalizeMoviePayload(req.body));
  res.status(201).json(movie);
}

async function deleteMovie(req, res) {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) {
    throw new AppError("Movie not found", 404);
  }

  res.json({ message: "Movie deleted successfully" });
}

async function getMoviesByActor(req, res) {
  const movies = await Movie.find({
    actors: { $in: [new RegExp(req.params.actorName, "i")] },
  });

  res.json(movies);
}

async function getMovieById(req, res) {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    throw new AppError("Movie not found", 404);
  }

  res.json(movie);
}

module.exports = {
  listMovies,
  createMovie,
  deleteMovie,
  getMoviesByActor,
  getMovieById,
};

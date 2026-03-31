const Movie = require("../models/Movie");

const AppError = require("../utils/appError");
const { normalizeMoviePayload } = require("../utils/movie");

async function listMovies(req, res) {
  const movies = await Movie.find().sort({ createdAt: -1 });
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

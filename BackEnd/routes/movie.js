const express = require("express");

const {
  listMovies,
  createMovie,
  deleteMovie,
  getMoviesByActor,
  getMovieById,
} = require("../controllers/movieController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(listMovies));
router.post("/add", asyncHandler(createMovie));
router.delete("/:id", asyncHandler(deleteMovie));
router.get("/actor/:actorName", asyncHandler(getMoviesByActor));
router.get("/:id", asyncHandler(getMovieById));

module.exports = router;

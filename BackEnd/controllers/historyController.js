const ViewHistory = require("../models/ViewHistory");

const AppError = require("../utils/appError");

async function logHistory(req, res) {
  const { movieId, movieTitle, moviePoster, tmdbId, progress, duration } = req.body;

  if (!movieId && !tmdbId) {
    throw new AppError("movieId or tmdbId is required", 400);
  }

  const query = {
    user: req.user.id,
    ...(movieId ? { movieId } : { tmdbId: String(tmdbId) }),
  };

  let history = await ViewHistory.findOne(query);

  if (history) {
    history.viewedAt = Date.now();
    history.duration = duration ?? history.duration;
    history.progress = progress ?? history.progress;
    history.movieTitle = movieTitle || history.movieTitle;
    history.moviePoster = moviePoster || history.moviePoster;
  } else {
    history = new ViewHistory({
      user: req.user.id,
      movieId: movieId || null,
      tmdbId: tmdbId ? String(tmdbId) : null,
      movieTitle: movieTitle || "Unknown title",
      moviePoster: moviePoster || "",
      duration: duration || 0,
      progress: progress || 0,
    });
  }

  const savedHistory = await history.save();
  res.status(201).json(savedHistory);
}

async function getUserHistory(req, res) {
  const histories = await ViewHistory.find({ user: req.user.id })
    .sort({ viewedAt: -1 })
    .limit(50);

  res.json(histories);
}

async function getAllHistory(req, res) {
  if (req.user.role !== "admin") {
    throw new AppError("Access denied", 403);
  }

  const histories = await ViewHistory.find()
    .populate("user", "name email")
    .sort({ viewedAt: -1 })
    .limit(100);

  res.json(histories);
}

async function deleteHistoryItem(req, res) {
  await ViewHistory.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ message: "History item deleted" });
}

async function clearHistory(req, res) {
  await ViewHistory.deleteMany({ user: req.user.id });
  res.json({ message: "History cleared" });
}

module.exports = {
  logHistory,
  getUserHistory,
  getAllHistory,
  deleteHistoryItem,
  clearHistory,
};

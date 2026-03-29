const express = require("express");
const router = express.Router();
const ViewHistory = require("../models/ViewHistory");
const Movie = require("../models/Movie");
const { protect } = require("../middleware/authMiddleware");

// 1. Ghi / cập nhật lịch sử xem phim
//    POST /api/history/log
//    Body: { movieId, movieTitle, moviePoster, tmdbId, progress, duration }
//    - movieId: MongoDB _id (nếu phim từ backend), hoặc null (nếu phim TMDB)
//    - tmdbId: TMDB id (string/number), hoặc null nếu phim backend
//    - progress: phần trăm đã xem (0-100), dùng để hiện "Đang xem"
//    - duration: tổng số giây đã xem
router.post("/log", protect, async (req, res) => {
  try {
    const { movieId, movieTitle, moviePoster, tmdbId, progress, duration } = req.body;

    // Tìm bản ghi lịch sử cũ (dùng movieId nếu có, không thì dùng tmdbId)
    const query = {
      user: req.user.id,
      ...(movieId ? { movieId } : { tmdbId: String(tmdbId) }),
    };

    let history = await ViewHistory.findOne(query);

    if (history) {
      // Cập nhật bản ghi cũ
      history.viewedAt = Date.now();
      history.duration = duration ?? history.duration;
      history.progress = progress ?? history.progress;
      history.movieTitle = movieTitle || history.movieTitle;
      history.moviePoster = moviePoster || history.moviePoster;
    } else {
      // Tạo bản ghi mới
      history = new ViewHistory({
        user: req.user.id,
        movieId: movieId || null,
        tmdbId: tmdbId ? String(tmdbId) : null,
        movieTitle: movieTitle || "Không rõ",
        moviePoster: moviePoster || "",
        duration: duration || 0,
        progress: progress || 0,
      });
    }

    const saved = await history.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Lỗi ghi lịch sử:", error);
    res.status(400).json({ message: "Lỗi khi ghi lịch sử xem" });
  }
});

// 2. Lấy lịch sử xem của người dùng hiện tại
//    GET /api/history/user
router.get("/user", protect, async (req, res) => {
  try {
    const histories = await ViewHistory.find({ user: req.user.id })
      .sort({ viewedAt: -1 })
      .limit(50); // Giới hạn 50 phim gần nhất

    res.json(histories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy lịch sử xem" });
  }
});

// 3. Lấy toàn bộ lịch sử xem (chỉ admin)
//    GET /api/history/all
router.get("/all", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }

    const histories = await ViewHistory.find()
      .populate("user", "name email")
      .sort({ viewedAt: -1 })
      .limit(100);

    res.json(histories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy lịch sử xem" });
  }
});

// 4. Xóa 1 mục lịch sử
//    DELETE /api/history/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    await ViewHistory.deleteOne({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Đã xóa mục lịch sử" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa lịch sử" });
  }
});

// 5. Xóa toàn bộ lịch sử của user
//    DELETE /api/history/clear
router.delete("/clear/all", protect, async (req, res) => {
  try {
    await ViewHistory.deleteMany({ user: req.user.id });
    res.json({ message: "Đã xóa lịch sử xem" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa lịch sử" });
  }
});

module.exports = router;

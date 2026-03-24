const express = require("express");
const router = express.Router();
const ViewHistory = require("../models/ViewHistory");
const Movie = require("../models/Movie");
const User = require("../models/User");

// Middleware xác thực người dùng (giả sử từ auth)
const authMiddleware = (req, res, next) => {
  const userId = req.headers["user-id"]; // Lấy từ header
  if (!userId) {
    return res.status(401).json({ message: "Không xác thực được người dùng" });
  }
  req.userId = userId;
  next();
};

// 1. Thêm lịch sử xem phim
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { movieId, movieTitle, duration } = req.body;

    // Kiểm tra phim và người dùng tồn tại
    const movie = await Movie.findById(movieId);
    const user = await User.findById(req.userId);

    if (!movie || !user) {
      return res.status(404).json({ message: "Phim hoặc người dùng không tìm thấy" });
    }

    // Kiểm tra xem có bản ghi cũ không, nếu có thì cập nhật thời gian
    let history = await ViewHistory.findOne({
      user: req.userId,
      movie: movieId,
    });

    if (history) {
      history.viewedAt = Date.now();
      history.duration = duration || history.duration;
    } else {
      history = new ViewHistory({
        user: req.userId,
        movie: movieId,
        movieTitle: movieTitle || movie.title,
        duration: duration || 0,
      });
    }

    const saved = await history.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi thêm lịch sử xem" });
  }
});

// 2. Lấy lịch sử xem của người dùng hiện tại
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const histories = await ViewHistory.find({ user: req.userId })
      .populate("movie")
      .sort({ viewedAt: -1 });

    res.json(histories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy lịch sử xem" });
  }
});

// 3. Lấy toàn bộ lịch sử xem (chỉ admin)
router.get("/all", authMiddleware, async (req, res) => {
  try {
    // Kiểm tra xem người dùng có phải admin không
    const user = await User.findById(req.userId);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }

    const histories = await ViewHistory.find()
      .populate("user")
      .populate("movie")
      .sort({ viewedAt: -1 });

    res.json(histories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy lịch sử xem" });
  }
});

// 4. Lấy thống kê phim được xem nhiều nhất
router.get("/stats/top-movies", async (req, res) => {
  try {
    const topMovies = await ViewHistory.aggregate([
      {
        $group: {
          _id: "$movie",
          count: { $sum: 1 },
          title: { $first: "$movieTitle" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movieDetails",
        },
      },
    ]);

    res.json(topMovies);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thống kê" });
  }
});

// 5. Xóa lịch sử xem của người dùng
router.delete("/clear", authMiddleware, async (req, res) => {
  try {
    await ViewHistory.deleteMany({ user: req.userId });
    res.json({ message: "Đã xóa lịch sử xem" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa lịch sử" });
  }
});

module.exports = router;

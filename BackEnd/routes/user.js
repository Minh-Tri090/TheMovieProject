// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware"); // Middleware kiểm tra Token
const Movie = require("../models/Movie");

// @route   POST /api/users/favorite/:movieId
// @desc    Thêm hoặc xóa phim khỏi danh sách yêu thích (Toggle)
router.post("/favorite/:movieId", protect, async (req, res) => {
  try {
    const { movieId } = req.params;
    const movieData = req.body; // Lấy thông tin phim gửi từ Frontend
    const user = await User.findById(req.user.id);

    // 1. Kiểm tra xem phim đã có trong bảng movies của Huy chưa
    let movie = await Movie.findOne({
      $or: [
        { _id: movieId.length === 24 ? movieId : null },
        { tmdbId: movieId },
      ],
    });

    // 2. Nếu CHƯA CÓ (phim từ API lần đầu được thích), hãy tạo mới nó vào DB
    if (!movie && movieData.title) {
      movie = await Movie.create({
        title: movieData.title,
        year: movieData.year,
        poster: movieData.poster,
        rating: movieData.rating,
        overview: movieData.overview,
        tmdbId: movieId, // Huy nên thêm trường tmdbId vào Model Movie để quản lý
      });
    }

    const targetId = movie ? movie._id : movieId;

    // 3. Logic Toggle (Thêm/Xóa) như cũ
    const isFavorite = user.favorites.includes(targetId);
    if (isFavorite) {
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== targetId.toString(),
      );
    } else {
      user.favorites.push(targetId);
    }

    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Lỗi xử lý yêu thích" });
  }
});

// @route   GET /api/users/favorites
// @desc    Lấy danh sách chi tiết các phim đã thích
router.get("/favorites", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.json(user.favorites); // Trả về mảng các Object phim đầy đủ
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách yêu thích" });
  }
});

module.exports = router;

// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware"); // Middleware kiểm tra Token

// @route   POST /api/users/favorite/:movieId
// @desc    Thêm hoặc xóa phim khỏi danh sách yêu thích (Toggle)
router.post("/favorite/:movieId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const movieId = req.params.movieId;

    const isFavorite = user.favorites.includes(movieId);

    if (isFavorite) {
      // Nếu đã có thì xóa đi
      user.favorites = user.favorites.filter((id) => id.toString() !== movieId);
    } else {
      // Nếu chưa có thì thêm vào
      user.favorites.push(movieId);
    }

    await user.save();
    res.json(user.favorites); // Trả về danh sách ID mới
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

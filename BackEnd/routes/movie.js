const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

// 1. Lấy toàn bộ danh sách phim từ Database
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 }); // Phim mới nhất lên đầu
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// 2. Thêm một bộ phim mới
router.post("/add", async (req, res) => {
  try {
    const data = req.body;
    // Chuyển rating từ String sang Number để MongoDB hiểu đúng
    if (data.rating) data.rating = Number(data.rating);

    const newMovie = new Movie(data);
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: "Lỗi dữ liệu" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy phim này Huy ơi!" });
    }

    await movie.deleteOne();
    res.json({ message: "Đã xóa phim thành công khỏi hệ thống!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server khi xóa phim" });
  }
});

module.exports = router;

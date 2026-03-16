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

module.exports = router;

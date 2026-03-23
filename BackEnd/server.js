const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movie");
const userRoutes = require("./routes/user");

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB (Huy sẽ lấy link từ MongoDB Atlas)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB"))
  .catch((err) => console.error("❌ Lỗi kết nối:", err));

// Route kiểm tra server
app.get("/", (req, res) => {
  res.send("Server THEMOVIE đang chạy vèo vèo!");
});

const PORT = process.env.PORT || 5000;
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Hàm tạo Token (Hạn dùng 7 ngày)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route   POST /api/auth/register
// @desc    Đăng ký người dùng mới
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Kiểm tra user tồn tại chưa
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: "Email này đã được đăng ký" });

    // 2. Tạo user mới (mật khẩu sẽ tự mã hóa nhờ hook ở Model)
    user = await User.create({ name, email, password });

    // 3. Trả về token và thông tin user
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("DEBUG ERROR REGISTER:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Đăng nhập người dùng
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Tìm user và lấy luôn cả password (vì model đang set select: false)
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });

    // 2. Kiểm tra mật khẩu bằng hàm comparePassword đã viết ở Model
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });

    // 3. Trả về token
    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;

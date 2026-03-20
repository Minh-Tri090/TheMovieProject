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
    // 1. Lấy thêm role và adminKey từ body
    const { name, email, password, role, adminKey } = req.body;

    // 2. Kiểm tra email tồn tại
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: "Email này đã được đăng ký" });

    // 3. Logic bảo mật cho quyền Admin
    let userRole = "user"; // Mặc định là user thường
    if (role === "admin") {
      // Huy có thể đổi "HUY_ADMIN_2026" thành mã khác tùy ý
      if (adminKey !== "HUY_ADMIN_2026") {
        return res
          .status(403)
          .json({ message: "Mã bí mật Admin không chính xác!" });
      }
      userRole = "admin";
    }

    // 4. Tạo user mới với role đã xác định
    user = await User.create({
      name,
      email,
      password,
      role: userRole,
    });

    // 5. Trả về token và ĐẦY ĐỦ thông tin user (bao gồm role)
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Quan trọng: Trả về để Frontend hiển thị nút Admin
      },
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

    // 1. Tìm user (lấy luôn password và role)
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });

    // 2. Kiểm tra mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });

    // 3. Trả về token và role hiện tại trong DB
    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Luôn trả về role để Frontend đồng bộ
      },
    });
  } catch (error) {
    console.error("DEBUG ERROR LOGIN:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;

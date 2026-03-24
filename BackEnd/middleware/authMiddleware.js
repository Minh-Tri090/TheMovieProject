const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // 1. Kiểm tra xem có token trong header Authorization không
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Lấy token từ chuỗi "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user từ DB (loại bỏ password) và gán vào request
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Người dùng không tồn tại" });
      }

      next(); // Cho phép đi tiếp vào Controller
    } catch (error) {
      console.error("Lỗi xác thực Token:", error);
      res
        .status(401)
        .json({ message: "Phiên đăng nhập hết hạn hoặc Token lỗi" });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ message: "Huy ơi, bạn cần đăng nhập để thực hiện thao tác này" });
  }
};

// ĐÂY LÀ CHỖ QUAN TRỌNG: Dùng module.exports thay vì export const
module.exports = { protect };

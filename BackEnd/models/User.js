const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Vui lòng nhập tên"],
  },
  email: {
    type: String,
    required: [true, "Vui lòng nhập email"],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
  },
  password: {
    type: String,
    required: [true, "Vui lòng nhập mật khẩu"],
    minlength: 6,
    select: false, // Không trả về mật khẩu khi query dữ liệu
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * MIDDLEWARE MÃ HÓA MẬT KHẨU
 * Chạy trước mỗi khi lưu (save) user
 */
UserSchema.pre("save", async function () {
  // Nếu mật khẩu không thay đổi thì không cần mã hóa lại
  if (!this.isModified("password")) return;

  try {
    // Tạo muối (salt) và thực hiện băm mật khẩu
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // Lưu ý: Với async function, Mongoose sẽ tự biết khi nào xong,
    // tuyệt đối không gọi next() ở đây để tránh lỗi "next is not a function"
  } catch (error) {
    throw error;
  }
});

/**
 * PHƯƠNG THỨC SO SÁNH MẬT KHẨU
 * Dùng khi đăng nhập
 */
UserSchema.methods.comparePassword = async function (enteredPassword) {
  // So sánh mật khẩu người dùng nhập vào với mật khẩu đã băm trong DB
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);

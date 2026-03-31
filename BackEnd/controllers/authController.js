const User = require("../models/User");

const AppError = require("../utils/appError");
const { buildAuthResponse } = require("../utils/auth");

const ADMIN_REGISTER_KEY = process.env.ADMIN_REGISTER_KEY || "HUY_ADMIN_2026";

async function register(req, res) {
  const { name, email, password, role, adminKey } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  let userRole = "user";
  if (role === "admin") {
    if (adminKey !== ADMIN_REGISTER_KEY) {
      throw new AppError("Invalid admin registration key", 403);
    }

    userRole = "admin";
  }

  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
  });

  res.status(201).json(buildAuthResponse(user));
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  res.json(buildAuthResponse(user));
}

module.exports = { register, login };

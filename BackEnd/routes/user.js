const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { toggleFavorite, getFavorites } = require("../controllers/userController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/favorite/:movieId", protect, asyncHandler(toggleFavorite));
router.get("/favorites", protect, asyncHandler(getFavorites));

module.exports = router;

const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const {
  logHistory,
  getUserHistory,
  getAllHistory,
  deleteHistoryItem,
  clearHistory,
} = require("../controllers/historyController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/log", protect, asyncHandler(logHistory));
router.get("/user", protect, asyncHandler(getUserHistory));
router.get("/all", protect, asyncHandler(getAllHistory));
router.delete("/clear/all", protect, asyncHandler(clearHistory));
router.delete("/:id", protect, asyncHandler(deleteHistoryItem));

module.exports = router;

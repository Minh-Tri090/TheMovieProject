const express = require("express");

const {
  getComments,
  createComment,
  updateComment,
  updateReply,
  addReply,
} = require("../controllers/commentController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/:movieId", asyncHandler(getComments));
router.post("/", asyncHandler(createComment));
router.put("/:id", asyncHandler(updateComment));
router.put("/:id/reply/:replyId", asyncHandler(updateReply));
router.post("/:id/reply", asyncHandler(addReply));

module.exports = router;

const Comment = require("../models/Comment");

const AppError = require("../utils/appError");
const { pickFields } = require("../utils/comment");

const COMMENT_CREATE_FIELDS = [
  "movieId",
  "user",
  "avatar",
  "text",
  "isSpoiler",
  "time",
  "badge",
  "upvotes",
  "downvotes",
];

const COMMENT_UPDATE_FIELDS = [
  "text",
  "isSpoiler",
  "time",
  "badge",
  "upvotes",
  "downvotes",
];

const REPLY_FIELDS = [
  "user",
  "avatar",
  "text",
  "isSpoiler",
  "time",
  "badge",
  "upvotes",
  "downvotes",
];

async function getComments(req, res) {
  const comments = await Comment.find({ movieId: req.params.movieId }).sort({
    createdAt: -1,
  });

  res.json(comments);
}

async function createComment(req, res) {
  const comment = await Comment.create(
    pickFields(req.body, COMMENT_CREATE_FIELDS),
  );

  res.status(201).json(comment);
}

async function updateComment(req, res) {
  const updates = pickFields(req.body, COMMENT_UPDATE_FIELDS);
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true },
  );

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  res.json(comment);
}

async function updateReply(req, res) {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  const reply = comment.replies.id(req.params.replyId);
  if (!reply) {
    throw new AppError("Reply not found", 404);
  }

  Object.assign(reply, pickFields(req.body, COMMENT_UPDATE_FIELDS));

  await comment.save();
  res.json(comment);
}

async function addReply(req, res) {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  comment.replies.push(pickFields(req.body, REPLY_FIELDS));
  await comment.save();

  const savedReply = comment.replies[comment.replies.length - 1];
  res.status(201).json(savedReply);
}

module.exports = {
  getComments,
  createComment,
  updateComment,
  updateReply,
  addReply,
};

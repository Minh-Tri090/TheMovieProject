const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
  user: { type: String, required: true },
  avatar: { type: String },
  text: { type: String, required: true },
  isSpoiler: { type: Boolean, default: false },
  time: { type: String, default: 'Vừa xong' },
  badge: { type: String, default: 'P.1 - Tập 1' },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const CommentSchema = new mongoose.Schema({
  movieId: { type: String, required: true, index: true },
  user: { type: String, required: true },
  avatar: { type: String },
  text: { type: String, required: true },
  isSpoiler: { type: Boolean, default: false },
  time: { type: String, default: 'Vừa xong' },
  badge: { type: String, default: 'P.1 - Tập 1' },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  replies: [ReplySchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", CommentSchema);

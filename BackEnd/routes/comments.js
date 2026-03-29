const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Lấy tất cả bình luận của một phim
router.get('/:movieId', async (req, res) => {
  try {
    const comments = await Comment.find({ movieId: req.params.movieId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm bình luận mới
router.post('/', async (req, res) => {
  const comment = new Comment({
    movieId: req.body.movieId,
    user: req.body.user,
    avatar: req.body.avatar,
    text: req.body.text,
    isSpoiler: req.body.isSpoiler,
    time: req.body.time,
    badge: req.body.badge
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật lượt bình chọn (upvote/downvote) hoặc thông tin khác của comment
router.put('/:id', async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Thay đổi bình chọn cho Reply bên trong bình luận chính
router.put('/:id/reply/:replyId', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    const reply = comment.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ message: 'Reply not found' });

    // Update fields from req.body
    if (req.body.upvotes !== undefined) reply.upvotes = req.body.upvotes;
    if (req.body.downvotes !== undefined) reply.downvotes = req.body.downvotes;
    
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Thêm Reply vào bình luận
router.post('/:id/reply', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const newReply = {
      user: req.body.user,
      avatar: req.body.avatar,
      text: req.body.text,
      isSpoiler: req.body.isSpoiler,
      time: req.body.time,
      badge: req.body.badge
    };

    comment.replies.push(newReply);
    await comment.save();
    
    const savedReply = comment.replies[comment.replies.length - 1]; // Trả về reply vừa thêm
    res.status(201).json(savedReply);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

// routes/commentRoute.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const Comment = require("../models/comment");
const Post = require("../models/post");

// [GET] Lấy danh sách bình luận của một bài
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch {
    res.status(500).json({ message: "Lỗi server khi lấy bình luận" });
  }
});

// [POST] Gửi bình luận
router.post("/:postId", verifyToken, async (req, res) => {
  try {
    const newComment = new Comment({
      user: req.user.id,
      post: req.params.postId,
      content: req.body.content,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch {
    res.status(500).json({ message: "Không thể thêm bình luận" });
  }
});

module.exports = router;

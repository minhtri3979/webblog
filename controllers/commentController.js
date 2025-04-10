const Comment = require("../models/comment");

// Thêm bình luận
const addComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const userId = req.user.id;

    const comment = new Comment({ user: userId, post: postId, content });
    await comment.save();

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Không thể thêm bình luận." });
  }
};

// Lấy danh sách bình luận theo bài viết
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy bình luận." });
  }
};

// Xoá bình luận (chỉ cho phép người tạo xóa)
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận." });
    }

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "Bạn không có quyền xóa bình luận này." });
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Đã xóa bình luận." });
  } catch (err) {
    res.status(500).json({ message: "Không thể xóa bình luận." });
  }
};

module.exports = {
  addComment,
  getCommentsByPost,
  deleteComment,
};

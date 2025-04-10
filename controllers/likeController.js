const Like = require("../models/like");
const Post = require("../models/post");
const Notification = require("../models/notification"); // Thêm model notification

exports.likePost = async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.postId;
  
    try {
      const post = await Post.findById(postId).populate("author", "_id");
      if (!post) return res.status(404).json({ message: "Bài viết không tồn tại" });
  
      const existing = await Like.findOne({ user: userId, post: postId });
  
      if (existing) {
        await Like.deleteOne({ _id: existing._id });
  
        const likeCount = await Like.countDocuments({ post: postId });
        return res.json({ liked: false, likeCount });
      }
  
      await Like.create({ user: userId, post: postId });
  
      // ✅ Tạo thông báo nếu không phải tự like
      if (post.author._id.toString() !== userId) {
        await Notification.create({
          fromUser: userId,             // người đã like
          toUser: post.author._id,      // tác giả bài viết
          post: postId,
          type: "like"
        });
      }
  
      const likeCount = await Like.countDocuments({ post: postId });
      res.json({ liked: true, likeCount });
  
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi xử lý like", error: err.message });
    }
  };

exports.hasUserLiked = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  try {
    const liked = await Like.exists({ user: userId, post: postId });
    res.json({ liked: !!liked });
  } catch (err) {
    res.status(500).json({ message: "Lỗi kiểm tra like" });
  }
};

exports.getLikeCount = async (req, res) => {
  const postId = req.params.postId;

  try {
    const count = await Like.countDocuments({ post: postId });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Lỗi đếm số lượt like" });
  }
};

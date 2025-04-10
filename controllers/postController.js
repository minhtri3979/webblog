const Post = require("../models/post");

// Lấy tất cả bài viết
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Tạo bài viết mới
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    const newPost = new Post({
      title,
      content,
      author: req.user.id,
      image,
    });

    const saved = await newPost.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Tạo bài viết thất bại" });
  }
};

// Lấy bài viết theo ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username");
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Cập nhật bài viết (chỉ người tạo mới được sửa)
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa bài viết này" });
    }

    const updatedData = {
      title: req.body.title,
      content: req.body.content,
    };

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Post.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Không thể cập nhật bài viết" });
  }
};

// Xóa bài viết
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Bạn không có quyền xóa bài viết này" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Đã xóa bài viết" });
  } catch (err) {
    res.status(500).json({ message: "Không thể xóa bài viết" });
  }
};

// Lấy bài viết theo user
const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("author", "username");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy bài viết của người dùng" });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getPostsByUser,
};

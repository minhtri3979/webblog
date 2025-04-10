const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  createPost,
  getAllPosts,
  getPostsByUser,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const verifyToken = require("../middlewares/authMiddleware");

// 📦 Cấu hình Multer cho upload ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Thư mục lưu ảnh
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// 📌 Lấy tất cả bài viết
router.get("/", getAllPosts);

// 📌 Lấy tất cả bài viết của một user
router.get("/user/:userId", verifyToken, getPostsByUser);

// 📌 Lấy bài viết theo ID
router.get("/:id", getPostById);

// 📌 Tạo bài viết (có thể kèm ảnh)
router.post("/", verifyToken, upload.single("image"), createPost);

// 📌 Cập nhật bài viết (có thể kèm ảnh mới)
router.put("/:id", verifyToken, upload.single("image"), updatePost);

// 📌 Xóa bài viết
router.delete("/:id", verifyToken, deletePost);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  likePost,
  hasUserLiked,
  getLikeCount
} = require("../controllers/likeController");
const verifyToken = require("../middlewares/authMiddleware");

// POST toggle like/unlike
router.post("/:postId", verifyToken, likePost);

// GET kiểm tra user đã like chưa
router.get("/:postId/status", verifyToken, hasUserLiked);

// GET tổng số lượt like
router.get("/:postId/count", getLikeCount);


module.exports = router;

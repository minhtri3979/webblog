const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const User = require("../models/user");

// Lấy tất cả user
router.get("/users", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Cập nhật vai trò user
router.patch("/users/:id/role", verifyToken, adminMiddleware, async (req, res) => {
  const { role } = req.body;

  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ message: "Vai trò không hợp lệ" });
  }

  try {
    await User.findByIdAndUpdate(req.params.id, { role });
    res.json({ message: "Cập nhật vai trò thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Xóa user
router.delete("/users/:id", verifyToken, adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa người dùng thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;

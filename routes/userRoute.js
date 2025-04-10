const express = require("express");
const User = require("../models/user");


const router = express.Router();

// ✅ [GET] /api/users - Lấy danh sách người dùng
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // ẩn trường password
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lấy danh sách thất bại" });
  }
});

// GET chi tiết người dùng theo ID
router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id, "-password");
      if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
  
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server" });
    }
});

// PUT cập nhật người dùng theo ID
router.put("/:id", async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body, // cập nhật theo dữ liệu gửi lên
        },
        { new: true, projection: { password: 0 } } // trả về bản ghi mới, không bao gồm password
      );
  
      if (!updatedUser) return res.status(404).json({ message: "Không tìm thấy người dùng" });
  
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server" });
    }
});

// DELETE người dùng theo ID
router.delete("/:id", async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
  
      if (!deletedUser) return res.status(404).json({ message: "Không tìm thấy người dùng" });
  
      res.json({ message: "Đã xóa người dùng thành công!" });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;


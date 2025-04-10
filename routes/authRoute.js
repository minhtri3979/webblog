const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");

const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

// ✅ [POST] /api/auth/register
router.post("/register", async (req, res) => {
    console.log("🟢 Nhận được POST /register");
  try {
    const { username, email, password } = req.body;

    // Kiểm tra xem đã có user chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Băm mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Đăng ký thất bại" });
  }
});

// ✅ [POST] /api/auth/login
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) return res.status(400).json({ message: "Email không đúng" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });
  
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role, // ✅ Thêm role vào token
        },
        "SECRET_KEY",
        { expiresIn: "1d" } // hoặc giữ "1d" nếu bạn muốn
      );
      
  
      res.status(200).json({
        message: "Đăng nhập thành công",
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Đăng nhập thất bại" });
    }
  });
  
// ✅ [GET] /api/auth/home - Chỉ truy cập nếu đã đăng nhập
router.get("/home", verifyToken, (req, res) => {
    res.status(200).json({ message: `Chào mừng ${req.user.email} đến với trang blog! 🚀` });
  });
console.log("✅ authRoute loaded");


module.exports = router;

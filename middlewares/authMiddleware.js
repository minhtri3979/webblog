const jwt = require("jsonwebtoken");

// Thay bằng .env nếu cần bảo mật
const SECRET_KEY = "SECRET_KEY"; // Hoặc dùng process.env.JWT_SECRET

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập hoặc thiếu token." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
      role: decoded.role || "user" // đảm bảo có role nếu dùng trong admin
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};

module.exports = verifyToken;

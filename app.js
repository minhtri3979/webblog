const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

// Import các routes
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const likeRoute = require("./routes/likeRoute");
const commentRoute = require("./routes/commentRoute");
const notificationRoute = require("./routes/notificationRoutes");
const followRoute = require("./routes/followRoute");
const adminRoute = require("./routes/adminRoute"); // ✅ Thêm route admin

const app = express();
const port = 3000;

// ✅ Kết nối cơ sở dữ liệu
connectDB();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Cho phép truy cập ảnh tĩnh từ thư mục /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Mount các routes API
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/likes", likeRoute);
app.use("/api/comments", commentRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/follows", followRoute);
app.use("/api/admin", adminRoute);

// ✅ Route test
app.get("/", (req, res) => {
  res.send("Hello Blog App 🚀");
});

// ✅ Khởi động server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});

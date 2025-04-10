const Notification = require("../models/notification");

exports.getNotifications = async (req, res) => {
  const userId = req.user.id;

  try {
    const notifications = await Notification.find({ toUser: userId })
      .sort({ createdAt: -1 })
      .populate("fromUser", "username")
      .populate("post", "title");

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy thông báo", error: err.message });
  }
};

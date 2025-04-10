const User = require("../models/user");
const Notification = require("../models/notification");

exports.followUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "Không thể theo dõi chính mình" });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Kiểm tra đã follow chưa
    if (!targetUser.followers.includes(currentUserId)) {
      targetUser.followers.push(currentUserId);
      await targetUser.save();

      // Tạo thông báo follow
      await Notification.create({
        fromUser: currentUserId,
        toUser: targetUserId,
        type: "follow"
      });
    }

    res.json({ message: "Đã theo dõi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    targetUser.followers = targetUser.followers.filter(f => f.toString() !== currentUserId);
    await targetUser.save();

    res.json({ message: "Đã hủy theo dõi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

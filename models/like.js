const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
}, { timestamps: true });

likeSchema.index({ user: 1, post: 1 }, { unique: true }); // Đảm bảo mỗi user chỉ like 1 lần/post

module.exports = mongoose.model("Like", likeSchema);

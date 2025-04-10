const express = require("express");
const router = express.Router();
const { getNotifications } = require("../controllers/notificationController");
const verifyToken = require("../middlewares/authMiddleware");

router.get("/", verifyToken, getNotifications); // GET /api/notifications

module.exports = router;

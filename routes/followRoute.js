const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const { followUser, unfollowUser } = require("../controllers/followController");

router.post("/:id", verifyToken, followUser);
router.delete("/:id", verifyToken, unfollowUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");
const { getUsers } = require("../controllers/userController");

router.get("/", protect, admin, getUsers);
router.get("/profile", protect, getUserProfile);

module.exports = router;
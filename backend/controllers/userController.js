const User = require("../models/User");

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc Get all users (Admin)
// @route GET /api/users
exports.getUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
};
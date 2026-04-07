const asyncHandler = require("express-async-handler");
const User = require("../models/User");

exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.json(users);
});

exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const nextIsAdmin =
    typeof req.body.isAdmin === "boolean" ? req.body.isAdmin : user.isAdmin;

  const adminSecretKey = String(req.body.adminSecretKey || "").trim();

  if (!user.isAdmin && nextIsAdmin) {
    if (!process.env.ADMIN_SECRET_KEY) {
      res.status(400);
      throw new Error("ADMIN_SECRET_KEY is missing in backend .env");
    }

    if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
      res.status(400);
      throw new Error("Invalid admin secret key");
    }
  }

  user.name = req.body.name ?? user.name;
  user.email = req.body.email ?? user.email;
  user.isAdmin = nextIsAdmin;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.json({ message: "User removed" });
});

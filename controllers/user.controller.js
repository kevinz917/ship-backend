const User = require("../models/user.model.js");

// Get users
const getUsers = async (req, res, next) => {
  try {
    console.log("Fetching users");

    let allUsers = await User.find();
    if (!allUsers) {
      const err = new Error("Could not fetch all users");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({
      message: "Fetched users successfully",
      users: allUsers,
    });
  } catch (err) {
    next(err);
  }
};

// Add user
const addUser = async (req, res, next) => {
  try {
    const newUser = new User({
      userIds: req.body.userIds,
      note: req.body.note,
      creator_netId: req.body.creator_netId,
      votes: req.body.votes,
      privacy: req.body.privacy,
    });
    let savedUser = await newUser.save();
    if (!savedUser) {
      const err = new Error("Could not add user");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({
      message: "Added user successfully",
      user: newUser,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  addUser,
};

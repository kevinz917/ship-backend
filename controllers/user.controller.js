const User = require("../models/user.model.js");

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

const addUser = async (req, res, next) => {
  try {
    const newUser = new User({
      email: req.body.email,
      netId: req.body.netId,
      studentId: req.body.studentId,
      ship_cnt: req.body.ship_cnt,
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

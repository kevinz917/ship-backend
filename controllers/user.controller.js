const User = require("../models/user.model.js");
const Ship = require("../models/ship.model");

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
      ships: req.body.ships,
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

// Fetch single user
const fetchUser = async (req, res, next) => {
  try {
    let userId = req.userId;
    let fetchedUser = await User.findById(userId);
    if (fetchedUser) {
      res
        .status(200)
        .json({ message: "Fetched user successfully", user: fetchedUser });
    }
  } catch (err) {
    return err;
  }
};

// Add ship to user
const addShip = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

// Remove ship from user
const removeShip = async (req, res, next) => {
  try {
    let userId = req.userId;
    let shipId = req.body.shipId;
    let fetchedUser = await User.findById(userId);

    if (fetchedUser.ships.includes(shipId)) {
      const idx = fetchedUser.ships.indexOf(shipId);
      fetchedUser.ships.splice(idx, 1);
    }

    await fetchedUser.save();

    await Ship.findOneAndDelete({ _id: shipId });
    res.status(200).json({ message: "Removed ship from user successful" });
  } catch (err) {
    next(err);
  }
};

// Toggle privacy
const togglePrivacy = async (req, res, next) => {
  try {
    let userId = req.userId;
    let mode = req.body.mode; //"public" or "private"

    let fetchedUser = await User.findById(req.userId);
    fetchedUser.privacy = mode;
    await fetchedUser.save();
    req.status(200).json({ message: `Toggled privacy to ${mode}` });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  addUser,
  addShip,
  removeShip,
  fetchUser,
  togglePrivacy,
};

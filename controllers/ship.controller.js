const Ship = require("../models/ship.model.js");
const User = require("../models/user.model");

// Get ship
const getShips = async (req, res, next) => {
  try {
    console.log("Fetching ships");

    let allShips = await Ship.find();
    if (!allShips) {
      const err = new Error("Could not fetch all ships");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({
      message: "Fetched ships successfully",
      ships: allShips,
    });
  } catch (err) {
    next(err);
  }
};

// Add ship
const addShip = async (req, res, next) => {
  try {
    const newShip = new Ship({
      userIds: req.body.userIds,
      note: req.body.note,
      creator_netId: req.body.creator_netId,
      votes: req.body.votes,
      privacy: req.body.privacy,
    });
    let savedShip = await newShips.save();
    if (!savedShip) {
      const err = new Error("Could not add ship");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({
      message: "Added ship successfully",
      ship: newShip,
    });
  } catch (err) {
    next(err);
  }
};

// Save ship
const saveShip = async (req, res, next) => {
  try {
    let shipId = req.body.shipId;
    const fetchedShip = await Ship.findById(shipId);
    (fetchedShip.note = req.body.note),
      (fetchedShip.votes = req.body.votes),
      (fetchedShip.userIds = req.body.userIds);

    let savedShip = await fetchedShip.save();
    if (!savedShip) {
      const err = new Error("Could not save ship");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({
      message: "Saved ship successfully",
      ship: savedShip,
    });
  } catch (err) {
    next(err);
  }
};

// Remove ship
const removeShip = async (req, res, next) => {
  try {
    let shipId = req.body.shipId;
    await Ship.findOneAndDelete({ _id: shipId });
    res.status(200).json({ message: "Deleted ship successfully" });
  } catch (err) {
    next(err);
  }
};

// Toggle voting
// auth { shipId(Str), vote(num)}
const toggleVote = async (req, res, next) => {
  try {
    let userId = req.body.userId;
    let shipId = req.body.shipId;
    let vote = req.body.vote;

    let fetchedShip = await Ship.findById(shipId);
    fetchedShip.votes += vote;
    await fetchedShip.save();

    let fetchedUser = await User.findById(userId);

    switch (count) {
      case 1:
        if (!fetchedUser.reactions.includes(shipId)) {
          fetchedUser.votes.push(shipId);
        }
        break;
      case -1:
        if (fetchedUser.reactions.includes(shipId)) {
          const idx = fetchedUser.votes.indexOf(shipId);
          fetchedUser.votes.splice(idx, 1);
        }
        break;
    }
  } catch (err) {
    next(err);
  }
};

// toggle privacy
const togglePrivacy = async (req, res, next) => {
  try {
    let shipId = req.body.shipId;
    let mode = req.body.mode;

    let fetchedShip = await Ship.findById(shipId);
    fetchedShip.privacy = mode;
    await fetchedShip.save();

    res.status(200).json({ message: `Toggle privacy successfully to ${Mode}` });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getShips,
  addShip,
  toggleVote,
  saveShip,
  removeShip,
  togglePrivacy,
};

const Ship = require("../models/ship.model.js");

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

module.exports = {
  getShips,
  addShip,
};

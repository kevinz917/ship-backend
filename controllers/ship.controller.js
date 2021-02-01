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
      userNames: req.body.userNames,
      note: req.body.note,
      creator_netId: req.session.netId,
      votes: 0,
      privacy: req.body.privacy,
    });
    let savedShip = await newShip.save();
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
      (fetchedShip.userNames = req.body.userNames);

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

const addMultiple = async (req, res, next) => {
  try {
    console.log(req.session.netId);
    let creator_netId = req.session.netId;
    let shipList = req.body.shipList;

    let fetchedUser = await User.find({ netId: creator_netId });

    // console.log(fetchedUser);

    // delete existing ships
    for (let i = 0; i < fetchedUser.ships.length; i++) {
      let shipId = fetchedUser.ships[i];
      await Ship.findByIdAndDelete(shipId);
    }

    console.log(shipList);

    for (let i = 0; i < shipList.length; i++) {
      let ship = shipList[i];

      // const newShip = new Ship({
      //   userNames: [
      //     ship[0].label.split(" ").slice(0, 2).join(" "),
      //     ship[1].label.split(" ").slice(0, 2).join(" "),
      //   ],
      //   netIds: [
      //     ship[0].value.split(" ").slice(0, 2).join(" "),
      //     ship[1].value.split(" ").slice(0, 2).join(" "),
      //   ],
      //   creator_netId: req.session.netId,
      //   votes: 0,
      //   privacy: req.body.privacy,
      // });
      // console.log(newShip);

      // Save ship
    }

    // add new ships
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
  addMultiple,
};

const Ship = require("../models/ship.model.js");
const User = require("../models/user.model");
const mailgun = require("mailgun-js");
const DOMAIN = "ship.wtf";
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

// Count ships
const countShips = async (req, res, next) => {
  try {
    let count = await Ship.count();
    res.json({ count: count });
  } catch (err) {
    next(err);
  }
};

// Get ship
const getShips = async (req, res, next) => {
  try {
    let userId = req.session.userId;
    let fetchedUser = await User.findById(userId);

    if (!fetchedUser) {
      const err = new Error("Could not add user");
      err.statusCode = 401;
      return next(err);
    }

    let allShips = await Ship.find().select("-creator_netId");

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
      userNames: req.body.userLabels.map((user) =>
        user.label.split(" ").slice(0, 2).join(" ")
      ),
      userLabels: req.body.userLabels,
      note: req.body.note,
      creator_netId: req.body.creator_netId,
      votes: 0,
      privacy: req.body.privacy,
      shippers: req.body.shippers,
      emails: req.body.emails,
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

// Remove ship
// const removeShip = async (req, res, next) => {
//   try {
//     let shipId = req.body.shipId;
//     await Ship.findOneAndDelete({ _id: shipId });
//     res.status(200).json({ message: "Deleted ship successfully" });
//   } catch (err) {
//     next(err);
//   }
// };

// Toggle voting
// auth { shipId(Str), vote(num)}
const toggleVote = async (req, res, next) => {
  try {
    let userId = req.session.userId;
    let shipId = req.body.shipId;
    let vote = req.body.vote;

    let fetchedShip = await Ship.findById(shipId);
    fetchedShip.votes += vote;
    await fetchedShip.save();

    let fetchedUser = await User.findById(userId);

    switch (vote) {
      case 1:
        if (!fetchedUser.votes.includes(shipId)) {
          fetchedUser.votes.push(shipId);
        }
        break;
      case -1:
        if (fetchedUser.votes.includes(shipId)) {
          const idx = fetchedUser.votes.indexOf(shipId);
          fetchedUser.votes.splice(idx, 1);
        }
        break;
    }
    await fetchedUser.save();
    res.status(200).json({ message: "Saved vote to user and ship" });
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

// Add ships
const addMultiple = async (req, res, next) => {
  try {
    let userId = req.session.userId;
    let creator_netId = req.session.netId;
    let shipList = req.body.shipList;

    let fetchedUser = await User.findById(userId);

    // delete existing ships
    for (let i = 0; i < fetchedUser.ships.length; i++) {
      let shipId = fetchedUser.ships[i];
      fetchedShip = await Ship.findById(shipId);

      if (fetchedShip) {
        // delete if you're the only shipper
        if (fetchedShip.shippers === 1) {
          await fetchedShip.remove();
        } else {
          // else reduce shippers by 1, save it
          fetchedShip.shippers -= 1;
          await fetchedShip.save();
        }
      }
    }

    // create new ships
    let savedShipIds = [];
    for (let i = 0; i < shipList.length; i++) {
      let ship = shipList[i];
      ship.sort((a, b) => {
        if (a.value > b.value) return 1;
        else return -1;
      });

      let emails = [ship[0].value, ship[1].value];

      // send both emails
      for (let i = 0; i < emails.length; i++) {
        if (!fetchedUser.emailed.includes(emails[i])) {
          const data = {
            from: "Ship <founders@ship.wtf>",
            to: emails[i],
            subject: `🚢 You've been shipped by someone ...`,
            template: "shipped",
            "h:X-Mailgun-Variables": JSON.stringify({
              BUTTON_URL: "ship.wtf",
            }),
          };

          mg.messages().send(data, function (error, body) {
            console.log(body);
          });
        }
      }

      const newShip = new Ship({
        userLabels: [ship[0].label, ship[1].label],
        userNames: ship.map((user) =>
          user.label.split(" ").slice(0, 2).join(" ")
        ),
        emails: emails,
        creator_netId: creator_netId,
        votes: 0,
        privacy: "public",
        shippers: 1,
      });

      // Try to find an existing ship
      let findMatchedShip = await Ship.findOne({ emails: emails });

      // Ship already exists
      if (findMatchedShip) {
        savedShipIds.push(findMatchedShip._id);
        findMatchedShip.shippers += 1;
        await findMatchedShip.save();
      } else {
        // Save new ship
        let savedShip = await newShip.save();
        savedShipIds.push(savedShip._id);
      }
    }

    // Save to user
    fetchedUser.ships = savedShipIds;

    // Add saved emails
    for (let i = 0; i < shipList.length; i++) {
      let ship = shipList[i];
      for (let j = 0; j < 2; j++) {
        if (fetchedUser.emailed.includes(ship[j].value)) {
          fetchedUser.emailed.push(ship[j].value);
        }
      }
    }

    let savedUser = await fetchedUser.save();
    if (savedUser) {
      res.status(200).json({ message: "Saved ships", user: savedUser });
    }
  } catch (err) {
    next(err);
  }
};

// Fetch ships that contain user
const fetchMyShips = async (req, res, next) => {
  try {
    let userId = req.session.userId;

    let fetchedUser = await User.findById(userId);
    let userEmail = fetchedUser.email;

    let myShips = await Ship.find({ emails: userEmail });

    if (myShips) {
      res
        .status(200)
        .json({ message: "Fetched ships that contain user", ships: myShips });
    }
  } catch (err) {
    next(err);
  }
};

// Remove ship
const removeShip = async (req, res, next) => {
  try {
    let shipId = req.body.shipId;
    console.log(shipId);

    // find users that created this ship
    let users = await User.find({ ships: shipId });
    for (let i = 0; i < users.length; i++) {
      let idx = users[i].ships.indexOf(shipId);
      users[i].ships.splice(idx, 1);
      await users[i].save();
    }

    let deletedShip = await Ship.findByIdAndDelete(shipId);
    if (deletedShip) {
      res.json({ message: `Deleted ship successfully: ${shipId}` });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getShips,
  addShip,
  toggleVote,
  removeShip,
  togglePrivacy,
  addMultiple,
  fetchMyShips,
  countShips,
};

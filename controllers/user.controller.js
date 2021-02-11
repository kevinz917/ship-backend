const User = require("../models/user.model.js");
const Ship = require("../models/ship.model");
const studentList = require("../util/studentList.json");
// Get users
const getUsers = async (req, res, next) => {
  try {
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

const emojiList = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😎",
];

const randNum = (a, b) => {
  return Math.random() * (b - a) + a;
};

// Add user
const addUser = async (req, res, next) => {
  try {
    const newUser = new User({
      email: req.body.email,
      netId: req.body.netId,
      ship_cnt: req.body.ship_cnt,
      privacy: req.body.privacy,
      ships: req.body.ships,
      votes: req.body.votes,
      profile: emojiList(randNum(0, len(emojiList - 1))),
      emailed: [],
      answers: [req.body.email, "", "", "", ""],
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
    let userId = req.session.userId;
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
    let userId = req.session.userId;
    let privacy = req.body.privacy; //"public" or "private"

    let fetchedUser = await User.findById(userId);
    fetchedUser.privacy = privacy;
    await fetchedUser.save();

    // change ships that contain user to privacy
    userEmail = fetchedUser.email;
    await Ship.updateMany({ emails: userEmail }, { privacy: privacy });

    res.status(200).json({ message: `Toggled privacy to ${privacy}` });
  } catch (err) {
    next(err);
  }
};

const fetchStudents = async (req, res, next) => {
  try {
    res.status(200).json({
      message: "Fetched student list successfully",
      data: studentList,
    });
  } catch (err) {
    next(err);
  }
};

const fetchUserShips = async (req, res, next) => {
  try {
    let userId = req.session.userId;
    let fetchedUser = await User.findById(userId);

    fetchedShips = [];
    for (let i = 0; i < fetchedUser.ships.length; i++) {
      let fetchedShip = await Ship.findById(fetchedUser.ships[i]);
      if (fetchedShip) {
        fetchedShips.push(fetchedShip);
      }
    }

    let data = [];
    for (let i = 0; i < fetchedShips.length; i++) {
      singleShip = fetchedShips[i];
      let ship = [null, null];
      ship[0] = {
        value: singleShip.emails[0],
        label: singleShip.userLabels[0],
      };
      ship[1] = {
        value: singleShip.emails[1],
        label: singleShip.userLabels[1],
      };
      data.push(ship);
    }

    res.status(200).json({ message: "Retrieved ships", ships: data });

    // Format data for frontend
  } catch (err) {
    next(err);
  }
};

// Save answers  to user
const saveAnswers = async (req, res, next) => {
  try {
    let userId = req.session.userId;
    let fetchedUser = await User.findById(userId);

    let answerObj = req.body.answerObj;
    let answerStr = [];
    for (let key in answerObj) {
      answerStr.push(answerObj[key]);
    }

    fetchedUser.answers = answerStr;
    let user = await fetchedUser.save();

    if (user) {
      res.status(200).json({ message: "Saved answers successfully" });
    }
  } catch (err) {
    next(err);
  }
};

// Fetch user answers
const fetchUserAnswers = async (req, res, next) => {
  try {
    let userEmail = req.body.userEmail;
    let shipId = req.body.shipId;

    // Fetch ship
    let fetchedShip = await Ship.findById(shipId);
    var emailWithoutCurrent = fetchedShip.emails.filter((x) => {
      return x !== userEmail;
    });

    let targetEmail = null;
    if (emailWithoutCurrent.length === 0) {
      // they shipped themselves lol
      targetEmail = userEmail;
    } else {
      targetEmail = emailWithoutCurrent[0];
    }

    // Fetch answers from target user
    let fetchedTargetUser = await User.findOne({ email: targetEmail });

    res.status(200).json({
      message: "Successfully fetched user partner's answers",
      answers: fetchedTargetUser.answers,
    });
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
  fetchStudents,
  fetchUserShips,
  saveAnswers,
  fetchUserAnswers,
};

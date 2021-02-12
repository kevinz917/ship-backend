const ms = require("ms");
const router = require("express").Router();
const userController = require("../controllers/user.controller");
var timeout = require("connect-timeout");

// Fetch all users
router.get("/", userController.getUsers);

// Add new user
router.post("/add", userController.addUser);

// Remove ship from user
router.post("/removeShip", userController.removeShip);

// Fetch user
router.get("/fetchUser", userController.fetchUser);

// Toggle privacy
router.post("/togglePrivacy", userController.togglePrivacy);

// Fetch all Yale Students
router.get("/allStudents", userController.fetchStudents);

// Fetch ships from users
router.get("/fetchShips", userController.fetchUserShips);

// Save answers to user
router.post("/saveAnswers", userController.saveAnswers);

// Fetch ship partner's answers
router.post("/fetchUserAnswers", userController.fetchUserAnswers);

// Fetch juicy data
router.get("/fetchData", userController.fetchData);

// Testing error handling
router.route("/test").get(setConnectionTimeout("0"), userController.test);

function setConnectionTimeout(time) {
  console.log("Setting");
  var delay = typeof time === "string" ? ms(time) : Number(time || 5000);

  return function (req, res, next) {
    req.connection.setTimeout(delay);
    next();
  };
}

module.exports = router;

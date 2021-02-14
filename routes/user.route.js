const ms = require("ms");
const router = require("express").Router();
const userController = require("../controllers/user.controller");
var timeout = require("connect-timeout");
const { auth } = require("../middleware/auth");

// Fetch all users
// router.get("/", userController.getUsers);

// Add new user
router.post("/add", userController.addUser);

// Remove ship from user
// router.post("/removeShip", auth, userController.removeShip);

// Fetch user
router.get("/fetchUser", auth, userController.fetchUser);

// Toggle privacy
// router.post("/togglePrivacy", auth, userController.togglePrivacy);

// Fetch all Yale Students
router.get("/allStudents", auth, userController.fetchStudents);

// Fetch ships from users
router.get("/fetchShips", auth, userController.fetchUserShips);

// Save answers to user
// router.post("/saveAnswers", auth, userController.saveAnswers);

// Fetch ship partner's answers
// router.post("/fetchUserAnswers", userController.fetchUserAnswers);

// Fetch juicy data
// router.get("/fetchData", userController.fetchData);

module.exports = router;

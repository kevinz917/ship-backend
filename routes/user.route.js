const router = require("express").Router();
const userController = require("../controllers/user.controller");

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

// Test
router.get("/test", userController.test);

module.exports = router;

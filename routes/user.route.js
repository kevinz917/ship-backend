const router = require("express").Router();
const userController = require("../controllers/user.controller");

// Fetch all users
router.get("/", userController.getUsers);

// Add new user
router.post("/add", userController.addUser);

// Remove ship from user
router.post("/removeShip", userController.removeShip);

// Fetch user
router.post("/fetchUser", userController.fetchUser);

// Toggle privacy
router.post("/togglePrivacy", userController.togglePrivacy);

// Fetch all Yale Students
router.get("/allStudents", userController.fetchStudents);

module.exports = router;

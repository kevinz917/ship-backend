const router = require("express").Router();
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth");

// Fetch all users
router.get("/", userController.getUsers);

// Add new user
router.post("/add", userController.addUser);

// Remove ship from user
router.post("/removeShip", auth, userController.removeShip);

// Fetch user
router.post("/fetchUser", auth, userController.fetchUser);

// Toggle privacy
router.post("/togglePrivacy", auth, userController.togglePrivacy);

module.exports = router;

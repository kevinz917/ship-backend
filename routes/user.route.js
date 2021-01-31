const router = require("express").Router();
const userController = require("../controllers/user.controller");

// Fetch all users
router.get("/", userController.getUsers);

// Add new user
router.post("/add", userController.addUser);

module.exports = router;

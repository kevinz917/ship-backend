const router = require("express").Router();
const shipController = require("../controllers/ship.controller");

// Fetch all ships
router.get("/", shipController.getShips);

// Add new ship
router.post("/add", shipController.addShip);

// Save ship
router.post("/save", shipController.saveShip);

// Toggle vote
router.post("/vote", shipController.toggleVote);

module.exports = router;

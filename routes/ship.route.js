const router = require("express").Router();
const shipController = require("../controllers/ship.controller");

// Fetch all ships
router.get("/", shipController.getShips);

// Add new ship
router.post("/add", shipController.addShip);

// Toggle vote
router.post("/vote", shipController.toggleVote);

module.exports = router;

const router = require("express").Router();
const shipController = require("../controllers/ship.controller");
const auth = require("../middleware/auth");

// Fetch all ships
router.get("/", shipController.getShips);

// Add new ship
router.post("/add", auth, shipController.addShip);

// Save ship
router.post("/save", auth, shipController.saveShip);

// Toggle vote
router.post("/vote", auth, shipController.toggleVote);

// Toggle privacy
router.post("/togglePrivacy", auth, shipController.toggleVote);

module.exports = router;

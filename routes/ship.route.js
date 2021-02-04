const router = require("express").Router();
const shipController = require("../controllers/ship.controller");

// Fetch all ships
router.get("/all", shipController.getShips);

// Add new ship
router.post("/add", shipController.addShip);

// Toggle vote
router.post("/vote", shipController.toggleVote);

// Toggle privacy
router.post("/togglePrivacy", shipController.togglePrivacy);

// Add multiple
router.post("/addMultiple", shipController.addMultiple);

// Fetch ships that contain user
router.post("/fetchMyShips", shipController.fetchMyShips);

module.exports = router;

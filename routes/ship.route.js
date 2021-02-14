const router = require("express").Router();
const shipController = require("../controllers/ship.controller");
const { auth } = require("../middleware/auth");

// Fetch all ships
router.get("/all", auth, shipController.getShips);

// Add new ship
// router.post("/add", auth, shipController.addShip);

// Toggle vote
// router.post("/vote", auth, shipController.toggleVote);

// Toggle privacy
// router.post("/togglePrivacy", auth, shipController.togglePrivacy);

// Add multiple
router.post("/addMultiple", auth, shipController.addMultiple);

// Fetch ships that contain user
router.post("/fetchMyShips", auth, shipController.fetchMyShips);

// Remove ship
// router.post("/removeShip", auth, shipController.removeShip);

// Count ships
router.post("/count", shipController.countShips);

module.exports = router;

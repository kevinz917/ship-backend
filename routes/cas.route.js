const router = require("express").Router();
const casController = require("../controllers/cas.controller");

// Check auth
router.get("/check", casController.casCheck);

// Login auth
router.get("/cas", casController.casLogin);

module.exports = router;

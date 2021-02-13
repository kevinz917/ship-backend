const User = require("../controllers/user.controller");

const auth = async (req, res, next) => {
  try {
    let userId = req.session.netId;
    // Check for user sessions

    if (!userId) {
      res.json({ message: "Not authorized" });
    }

    next();
  } catch (errror) {
    res.status(400).json({ message: "Auth error" });
  }
};

module.exports = { auth };

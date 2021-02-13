const User = require("../controllers/user.controller");

const auth = async (req, res, next) => {
  try {
    let userId = req.session.netId;
    if (!userId) {
      res.json({ message: "Not authorized" });
    }

    // Check for user sessions
    console.log(userId);
    next();
  } catch (errror) {
    res.status(400).json({ message: "Auth error" });
  }
};

module.exports = { auth };

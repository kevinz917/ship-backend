const auth = (req, res, next) => {
  const accessToken = req.header("access-token");

  if (accessToken) {
    req.userId = accessToken;
    next();
  } else {
    res.status(400).json({ status: "failure", message: "invalid token" });
  }
};

module.exports = auth;

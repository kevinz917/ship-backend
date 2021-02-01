const passport = require("passport");
const CasStrategy = require("passport-cas").Strategy;
const StudentInfo = require("../util/students.json");
const User = require("../models/user.model.js");

passport.use(
  new CasStrategy(
    {
      version: "CAS2.0",
      ssoBaseURL: "https://secure.its.yale.edu/cas",
    },
    function (profile, done) {
      done(null, {
        netId: profile.user,
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.netId);
});

passport.deserializeUser(function (netId, done) {
  const user = {
    netId,
  };
  done(null, user);
});

const casLogin = (req, res, next) => {
  passport.authenticate("cas", async function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error("CAS auth but no user"));
    }

    req.logIn(user, async function (err) {
      //   console.log(user);
      if (err) {
        return next(err);
      }
      // console.log("login", req.user);
      if (req.user) {
        const netId = req.user.netId;
        req.session.netId = netId;
        let models = await User.find({ netId: netId });
        if (models.length === 0) {
          const newUser = new User({
            email: StudentInfo[req.user.netId].email,
            netId: netId,
            name: StudentInfo[req.user.netId].name,
            ship_cnt: 3,
            privacy: "public",
            ships: [],
            votes: [],
          });
          let savedUser = await newUser.save();
          if (!savedUser) {
            const err = new Error("Could not add user");
            err.statusCode = 404;
            return next(err);
          }
          console.log("Created new user model");
          req.session.userId = savedUser._id;
        } else {
          req.session.userId = models[0]._id;
        }
      }
      if (req.query.redirect) {
        return res.redirect(req.query.redirect);
      }

      return res.redirect(process.env.FRONTEND_URL + "leaderboard");
    });
  })(req, res, next);
};

const casCheck = function (req, res) {
  console.log("check", req.user);
  console.log("session", req.session);
  if (req.user && req.session.userId) {
    res.json({
      auth: true,
      user: { netId: req.user.netId, userId: req.session.userId },
    });
  } else {
    res.json({ auth: false });
  }
};

module.exports = {
  casLogin: casLogin,
  casCheck: casCheck,
};

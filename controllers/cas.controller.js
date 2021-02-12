const passport = require("passport");
const CasStrategy = require("passport-cas").Strategy;
const StudentInfo = require("../util/students.json");
const User = require("../models/user.model.js");
const Cookies = require("universal-cookie");

const cookies = new Cookies();

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
      if (err) {
        return next(err);
      }
      userId = null;
      if (req.user) {
        const netId = req.user.netId;
        req.session.netId = netId;
        let models = await User.find({ netId: netId });
        if (models.length === 0) {
          const newUser = new User({
            email: StudentInfo[req.user.netId].email,
            netId: netId,
            name: StudentInfo[req.user.netId].name,
            ship_cnt: 5,
            privacy: "public",
            ships: [],
            votes: [],
            emailed: [],
            answers: [StudentInfo[req.user.netId].email, "", "", "", ""],
          });
          let savedUser = await newUser.save();

          // cookies.set("userId", netId);

          if (!savedUser) {
            const err = new Error("Could not add user");
            err.statusCode = 404;
            return next(err);
          }
          req.session.userId = savedUser._id;
          userId = savedUser._id;
        } else {
          req.session.userId = models[0]._id;
          userId = req.session.userId;
        }
      }
      if (req.query.redirect) {
        return res.redirect(req.query.redirect);
      }
      res.cookie("userId", userId);
      return res.redirect(process.env.FRONTEND_URL + "ship");
    });
  })(req, res, next);
};

const casCheck = function (req, res) {
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

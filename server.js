const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.set("trust proxy", true);
app.use(express.json());

const store = new MongoDBStore({
  uri: process.env.ATLAS_URI,
  collection: "userSessions",
  expires: 365 * 24 * 60 * 60 * 1000,
});
store.on("error", function (error) {
  console.log(error);
});

app.use(cookieParser("this cas shit dumb as fuck"));
app.use(
  session({
    secret: "this cas shit dumb as fuck",
    store: store,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: false,
      sameSite: true,
      secure: port === 5000 ? false : true,
    },
  })
);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ship.wtf",
      "https://www.ship.wtf",
      "https://staging.ship.wtf",
      "https://web.postman.co",
    ],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.pluralize(null);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("✅ MongoDB database connection established!");
});

(async () => {
  // Setup routes.
  const shipRouter = require("./routes/ship.route");
  app.use("/ship", shipRouter);

  const userRouter = require("./routes/user.route");
  app.use("/user", userRouter);

  const casRouter = require("./routes/cas.route");
  app.use(passport.initialize());
  app.use(passport.session());
  app.use("/auth", casRouter);

  // Once routes have been created, start listening.
  app.listen(port, () => {
    console.log(`🔵 Server is running on port: ${port}`);
  });
})();

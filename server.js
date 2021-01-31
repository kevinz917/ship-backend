const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.set("trust proxy", true);
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ship.wtf",
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
  console.log("MongoDB database connection established!");
});

(async () => {
  // Setup routes.
  const shipRouter = require("./routes/ship.route");
  app.use("/ship", shipRouter);

  const userRouter = require("./routes/user.route");
  app.use("/user", userRouter);

  // Once routes have been created, start listening.
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
})();

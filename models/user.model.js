const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  netId: { type: String, required: true },
  studentId: { type: String, required: true },
  ship_cnt: { type: Number, required: true },
  ships: { type: Array, required: true },
  privacy: { type: String, required: true },
  votes: { type: Array, required: true },
});

const User = mongoose.model("user", userSchema);

module.exports = User;

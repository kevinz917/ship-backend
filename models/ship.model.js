const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shipSchema = new Schema(
  {
    userIDs: { type: [String], required: true },
    note: { type: String, required: false },
    creator_netId: { type: String, required: true },
    votes: { type: Number, required: true },
    privacy: { type: String, required: true },
  },
  { timestamps: true }
);

const Ship = mongoose.model("ship", shipSchema);

module.exports = Ship;

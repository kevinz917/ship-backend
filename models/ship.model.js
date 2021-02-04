const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shipSchema = new Schema(
  {
    userNames: { type: [String], required: true },
    userLabels: { type: [String], required: true },
    emails: { type: [String], required: false },
    note: { type: String, required: false },
    creator_netId: { type: String, required: true },
    shippers: { type: Number, required: true },
    votes: { type: Number, required: true },
    privacy: { type: String, required: true },
  },
  { timestamps: true }
);

const Ship = mongoose.model("ship", shipSchema);

module.exports = Ship;

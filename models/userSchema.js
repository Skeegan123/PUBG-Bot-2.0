const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userID: { type: String, required: true },
  serverID: { type: String, required: true },
  tag: { type: String, required: true },
  pubgBucks: { type: Number, default: 1200 },
  bank: { type: Number, default: 0 },
  messagesSent: { type: Number, default: 0 },
});

const model = mongoose.model("Users", userSchema);

module.exports = model;

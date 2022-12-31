const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
  guildID: { type: String, required: true, unique: true },
  guildName: { type: String, required: true },
  ownerID: { type: String, required: true },
  guildMemberCount: { type: Number, required: true },
});

const model = mongoose.model("Guilds", guildSchema);

module.exports = model;

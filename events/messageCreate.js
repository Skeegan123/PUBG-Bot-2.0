const { Events } = require("discord.js");
const Users = require("../models/userSchema");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    let profile;

    // check if the user is already in the database
    profile = await Users.findOne({
      userID: message.author.id,
      serverID: message.guildId,
    });

    if (!profile) {
      profile = await Users.create({
        userID: message.author.id,
        serverID: message.guildId,
        tag: message.author.tag,
      });
    }

    profile.messagesSent++;
    profile.pubgBucks += 2;
    profile.save();
  },
};

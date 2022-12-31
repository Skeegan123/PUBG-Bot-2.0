const { Events } = require("discord.js");
const Users = require("../models/userSchema");
const Guilds = require("../models/guildSchema");

module.exports = {
  name: Events.GuildCreate,
  async execute(guild) {
    console.log("I have joined a new guild: " + guild.name);

    // add the guild to the database
    let server = await Guilds.create({
      guildID: guild.id,
      guildName: guild.name,
      ownerID: guild.ownerId,
      guildMemberCount: guild.memberCount,
      guildMusicQueue: [],
    });
    server.save();

    // loop through a list of members and add them to the database
    guild.members.cache.forEach(async (member) => {
      if (!member.user.bot) {
        let profile;

        // check if the user is already in the database
        profile = await Users.findOne({
          userID: member.user.id,
          serverID: member.guild.id,
        });

        if (!profile) {
          profile = await Users.create({
            userID: member.user.id,
            serverID: member.guild.id,
            tag: member.user.tag,
          });
          profile.save();
        }
      }
    });
  },
};

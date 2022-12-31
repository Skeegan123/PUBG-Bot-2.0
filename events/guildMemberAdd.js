const { Events } = require("discord.js");
const Users = require("../models/userSchema");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    console.log(
      member.user.username +
        "#" +
        member.user.discriminator +
        " joined the server."
    );

    let welcomeRole = member.guild.roles.cache.find(
      (role) => role.name === "smooth brains"
    );

    try {
      await member.roles.add(welcomeRole);
    } catch (err) {
      console.log(err);
    }

    console.log(
      member.user.tag + " was given the " + welcomeRole.name + " role."
    );

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
  },
};

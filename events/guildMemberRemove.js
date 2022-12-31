const { Events } = require("discord.js");
const Users = require("../models/userSchema");

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    console.log(`${member.user.tag} left the server.`);
    Users.deleteOne({ userID: member.user.id, serverID: member.guild.id })
      .then(function () {
        console.log("Data deleted"); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
  },
};

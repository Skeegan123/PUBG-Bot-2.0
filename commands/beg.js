const { SlashCommandBuilder } = require("discord.js");
const Users = require("../models/userSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("beg")
    .setDescription("Beg for pubgBucks!"),
  async execute(interaction) {
    await interaction.reply("Begging...");
    // Gives a random amount of pubgBucks between 1 and 250
    const pubgBucks = Math.floor(Math.random() * 25) + 1;
    let profile;

    // check if the user is already in the database
    profile = await Users.findOne({
      userID: interaction.user.id,
      serverID: interaction.guild.id,
    });

    if (!profile) {
      profile = await Users.create({
        userID: interaction.user.id,
        serverID: interaction.guild.id + "11238",
        tag: interaction.user.tag,
      });
      profile.save();
    }
    profile.pubgBucks += pubgBucks;
    profile.save();
    await interaction.editReply(
      `${interaction.user.username} begged and received ${pubgBucks} pubgBucks!`
    );
  },
};

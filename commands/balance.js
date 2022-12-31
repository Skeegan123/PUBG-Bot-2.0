const { SlashCommandBuilder } = require("discord.js");
const Users = require("../models/userSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your pubgBuck balance"),
  async execute(interaction) {
    await interaction.reply({
      content: "Checking balance...",
      ephemeral: true,
    });

    let profile;

    // check if the user is already in the database
    profile = await Users.findOne({
      userID: interaction.user.id,
      serverID: interaction.guild.id,
    });

    if (!profile) {
      profile = await Users.create({
        userID: interaction.user.id,
        serverID: interaction.guild.id,
        tag: interaction.user.tag,
      });
      profile.save();
    }

    await interaction.editReply({
      content: `You have ${profile.pubgBucks} pubgBucks!`,
      ephemeral: true,
    });
  },
};

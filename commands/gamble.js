const { SlashCommandBuilder } = require("discord.js");
const Users = require("../models/userSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gamble")
    .setDescription("Gamble for pubgBucks!")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of pubgBucks to gamble")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("How do you want to gamble?")
        .setRequired(true)
        .addChoices(
          { name: "Flip a coin (1 in 2 odds)", value: "coin" },
          { name: "Roll a dice (1 in 6 odds)", value: "dice" },
          { name: "Spin a wheel (1 in 10 odds)", value: "wheel" }
        )
    ),
  async execute(interaction) {
    await interaction.reply("Gambling...");
    let amount = interaction.options.getInteger("amount");
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
    if (amount > profile.pubgBucks) {
      return interaction.editReply(
        "You don't have enough pubgBucks to gamble that much!"
      );
    }
    profile.pubgBucks -= amount;
    let win = false;
    let game = "";

    // Case statement to determine form of gambling
    switch (interaction.options.getString("game")) {
      case "coin":
        game = "flipped a coin";
        // Has a 50% chance of winning double the amount
        if (Math.random() < 0.51) {
          amount *= 2;
          profile.pubgBucks += amount;
          win = true;
        }
        break;
      case "dice":
        game = "rolled a dice";
        // Has a 16.666% chance of winning 6 times the amount
        if (Math.random() < 0.17) {
          amount *= 6;
          profile.pubgBucks += amount;
          win = true;
        }
        break;
      case "wheel":
        game = "spun a wheel";
        // Has a 10% chance of winning 10 times the amount
        if (Math.random() < 0.11) {
          amount *= 10;
          profile.pubgBucks += amount;
          win = true;
        }
        break;
    }
    profile.save();

    if (win) {
      await interaction.editReply(
        `${interaction.user.username} ${game} and won ${amount} pubgBucks!`
      );
    } else {
      await interaction.editReply(
        `${interaction.user.username} ${game} and lost ${amount} pubgBucks!`
      );
    }
  },
};

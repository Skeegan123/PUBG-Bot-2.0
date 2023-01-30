const { SlashCommandBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const { OPEN_AI_KEY } = require("../config.json");
const Users = require("../models/userSchema");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("imagine")
    .setDescription(
      "Generate images with OpenAI's DALLE model. Costs 500 pubgBucks per use!"
    )
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription(
          "Write a description for the image you want to generate."
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.reply("Generating image...");

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
    }

    if (profile.pubgBucks < 250) {
      console.log(
        `User ${interaction.user.tag} tried to use imagine but didn't have enough pubgBucks!`
      );
      return await interaction.editReply(
        "You don't have enough pubgBucks to use this command!"
      );
    }

    profile.pubgBucks -= 250;

    profile.save();

    const configuration = new Configuration({
      apiKey: OPEN_AI_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai
      .createImage({
        prompt: interaction.options.getString("prompt"),
        n: 1,
        size: "1024x1024",
      })
      .catch((err) => {
        console.log(err);
        return interaction.editReply("An error occurred! Try again later!");
      });

    image_url = response.data.data[0].url;

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Prompt:")
      .setDescription(interaction.options.getString("prompt"))
      .setImage(image_url)
      .setTimestamp();
    interaction.editReply({ embeds: [embed] });
  },
};

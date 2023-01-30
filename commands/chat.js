const { SlashCommandBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const { OPEN_AI_KEY } = require("../config.json");
const Users = require("../models/userSchema");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription(
      "Chat with the bot! Uses OpenAI's GPT-3 API! Costs 100 pubgBucks per use!"
    )
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("What do you want to say to the bot?")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.reply("Chatting...");

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

    if (profile.pubgBucks < 100) {
      console.log(
        `User ${interaction.user.tag} tried to use chat but didn't have enough pubgBucks!`
      );
      return await interaction.editReply(
        "You don't have enough pubgBucks to use this command!"
      );
    }

    profile.pubgBucks -= 100;

    profile.save();

    const configuration = new Configuration({
      apiKey: OPEN_AI_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: interaction.options.getString("prompt"),
        temperature: 0.6,
        max_tokens: 250,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      })
      .catch((err) => {
        console.log(err);
        return interaction.editReply("An error occurred! Try again later!");
      });

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Prompt:")
      .setDescription(interaction.options.getString("prompt"))
      .addFields({
        name: "Response:",
        value: response.data.choices[0].text,
      })
      .setTimestamp();
    interaction.editReply({ embeds: [embed] });

    console.log(
      "The below interation used " +
        response.data.usage.total_tokens +
        " openAI tokens."
    );
  },
};

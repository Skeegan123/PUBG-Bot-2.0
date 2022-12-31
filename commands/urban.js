const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { urban_key, urban_host } = require("../config.json");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("urban")
    .setDescription("Looks up a word on urban dictionary")
    .addStringOption((option) =>
      option
        .setName("word")
        .setDescription("The word you would like to look up")
        .setRequired(true)
    ),
  async execute(interaction) {
    // Create the options for the request to the urban dictionary API
    const options = {
      method: "GET",
      url: "https://mashape-community-urban-dictionary.p.rapidapi.com/define",
      params: { term: interaction.options.getString("word") },
      headers: {
        "X-RapidAPI-Key": urban_key,
        "X-RapidAPI-Host": urban_host,
      },
    };

    await interaction.deferReply();

    // Send request to urban dictionary API
    await axios
      .request(options)
      .then(function (response) {
        if (response.data.list.length == 0) {
          interaction.editReply("No results found.");
        } else {
          // Loop through the results to find match with the most thumbs up
          let bestMatch = 0;
          let currentMaxUpvotes = 0;
          for (let i = 0; i < response.data.list.length; i++) {
            if (response.data.list[i].thumbs_up > currentMaxUpvotes) {
              currentMaxUpvotes = response.data.list[i].thumbs_up;
              bestMatch = i;
            }
          }

          // Create the embed to nicely display the result
          const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(response.data.list[bestMatch].word)
            .setURL(response.data.list[bestMatch].permalink)
            .setAuthor({
              name: response.data.list[bestMatch].author,
              iconURL: "https://i.imgur.com/Dq1IprK.png",
            })
            .setDescription(response.data.list[bestMatch].definition)
            .setThumbnail("https://i.imgur.com/Dq1IprK.png")
            .addFields(
              { name: "Example", value: response.data.list[bestMatch].example },
              {
                name: "Upvotes",
                value: response.data.list[bestMatch].thumbs_up.toString(),
                inline: true,
              },
              {
                name: "Downvotes",
                value: response.data.list[bestMatch].thumbs_down.toString(),
                inline: true,
              }
            )
            .setTimestamp();
          interaction.editReply("Here is what I found:");
          interaction.editReply({ embeds: [embed] });
        }
      })
      .catch(function (error) {
        interaction.editReply("An error occurred.");
        console.error(error);
      });
  },
};

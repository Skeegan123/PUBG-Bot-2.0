const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("new").setDescription("Starts a new chat with ChatGPT"),
  async execute(interaction) {
    // Create a reply to the command
    const reply = await interaction.reply("Deleting all messages from this channel...");
    const channelID = interaction.channelId;
    const channel = interaction.client.channels.cache.get(channelID);
    if (channelID === "1088164318203355337") {
      // Fetch the messages in the channel
      channel.messages.fetch().then((messages) => {
        // Delete the messages using bulkDelete()
        channel
          .bulkDelete(messages)
          .then(() => console.log("All messages deleted!"))
          .catch((error) => console.error(`Error deleting messages: ${error}`));
      });
    }
  },
};

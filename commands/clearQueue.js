const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears the queue"),

  async execute(interaction) {
    await interaction.deferReply();
    let guildQueue = interaction.client.player.getQueue(interaction.guildId);
    if (!guildQueue) {
      return await interaction.editReply("There is no music in the queue!");
    }
    guildQueue.clearQueue();
    await interaction.editReply("Cleared the queue!");
  },
};

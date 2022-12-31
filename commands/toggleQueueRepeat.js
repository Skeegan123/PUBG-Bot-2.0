const { SlashCommandBuilder } = require("@discordjs/builders");
const { RepeatMode } = require("discord-music-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("toggle-queue-repeat")
    .setDescription("Turns queue repeat on or off"),

  async execute(interaction) {
    await interaction.deferReply();
    let guildQueue = interaction.client.player.getQueue(interaction.guildId);
    if (!guildQueue) {
      return await interaction.editReply("There is no music playing!");
    }
    if (guildQueue.repeatMode === RepeatMode.DISABLED) {
      guildQueue.setRepeatMode(RepeatMode.QUEUE);
      await interaction.editReply("Enabled queue repeat!");
    } else if (guildQueue.repeatMode === RepeatMode.SONG) {
      guildQueue.setRepeatMode(RepeatMode.QUEUE);
      await interaction.editReply("Enabled queue repeat!");
    } else if (guildQueue.repeatMode === RepeatMode.QUEUE) {
      guildQueue.setRepeatMode(RepeatMode.DISABLED);
      await interaction.editReply("Disabled queue repeat!");
    }
  },
};

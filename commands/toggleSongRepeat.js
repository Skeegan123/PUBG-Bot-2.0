const { SlashCommandBuilder } = require("@discordjs/builders");
const { RepeatMode } = require("discord-music-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("toggle-song-repeat")
    .setDescription("Turns song repeat on or off"),

  async execute(interaction) {
    await interaction.deferReply();
    let guildQueue = interaction.client.player.getQueue(interaction.guildId);
    if (!guildQueue) {
      return await interaction.editReply("There is no music playing!");
    }
    if (guildQueue.repeatMode === RepeatMode.QUEUE) {
      guildQueue.setRepeatMode(RepeatMode.SONG);
      await interaction.editReply("Enabled song repeat!");
    } else if (guildQueue.repeatMode === RepeatMode.DISABLED) {
      guildQueue.setRepeatMode(RepeatMode.SONG);
      await interaction.editReply("Enabled song repeat!");
    } else if (guildQueue.repeatMode === RepeatMode.SONG) {
      guildQueue.setRepeatMode(RepeatMode.DISABLED);
      await interaction.editReply("Disabled song repeat!");
    }
  },
};

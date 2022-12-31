const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("song")
    .setDescription("Displays the current song"),

  async execute(interaction) {
    await interaction.deferReply();
    let guildQueue = interaction.client.player.getQueue(interaction.guildId);
    if (!guildQueue) {
      return await interaction.editReply("There is no music playing!");
    }
    let song = guildQueue.nowPlaying;
    await interaction.editReply(`Now playing: ${song}`);
  },
};

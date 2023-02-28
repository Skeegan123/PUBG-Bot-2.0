const { SlashCommandBuilder } = require("@discordjs/builders");
const { Utils } = require("discord-music-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays or queues a song")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The song you would like to play")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    let guildQueue = interaction.client.player.getQueue(interaction.guildId);
    let queue = interaction.client.player.createQueue(interaction.guildId);
    let song = interaction.options.getString("song");
    let url;
    let isURL = true;
    try {
      url = new URL(string);
    } catch (_) {
      isURL = false;
    }
    try {
      if (!isURL) {
        song = await Utils.best(song, undefined, queue);
      } else {
        song = await Utils.link(song, undefined, queue);
      }
    } catch (e) {
      interaction.editReply("No results found!");
      console.log("No results found!");
      return 0;
    }
    try {
      await queue.join(interaction.member.voice.channel);
    } catch {
      queue.stop();
      return await interaction.editReply(
        "I could not join your voice channel! Try again!"
      );
    }
    await interaction.editReply(
      `Adding ${song.name} to the queue. [${song.url}]`
    );
    console.log(`Added ${song.name} to the queue. [${song.url}]`);
    let track = await queue.play(song.url).catch(() => {
      if (!guildQueue) {
        queue.stop();
      }
    });
  },
};

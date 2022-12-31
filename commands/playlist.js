const { SlashCommandBuilder } = require("@discordjs/builders");
const play = require("play-dl");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("Plays or queues a playlist")
    .addStringOption((option) =>
      option
        .setName("playlist-url")
        .setDescription("The playlist you would like to play")
    ),

  async execute(interaction) {
    await interaction.deferReply();
    let guildQueue = interaction.client.player.getQueue(interaction.guildId);
    let song = interaction.options.getString("playlist-url");
    if (!song.includes("https://")) {
      await interaction.editReply("Please provide a valid playlist URL!");
      return;
    } else if (song.includes("open.spotify.com")) {
      await interaction.editReply(
        "Spotify is not supported yet. Yell at Keegan to get it done."
      );
      return;
    }
    let queue = interaction.client.player.createQueue(interaction.guildId);
    try {
      await queue.join(interaction.member.voice.channel);
    } catch {
      queue.stop();
      return await interaction.editReply(
        "I could not join your voice channel! Try again!"
      );
    }
    await interaction.editReply(`Added a playlist to the queue.`);
    // console.log(`Added a playlist to the queue. [${song}]`);
    let track = await queue.play(song).catch(() => {
      if (!guildQueue) {
        queue.stop();
      }
    });
  },
};

const { SlashCommandBuilder } = require("@discordjs/builders");
const play = require("play-dl");

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
    let song = interaction.options.getString("song");
    if (!song.includes("https://")) {
      song = await play.search(song, { limit: 1 });
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
    await interaction.editReply(
      `Adding ${song[0].title} to the queue. [${song[0].url}]`
    );
    // console.log(`Added ${song[0].title} to the queue. [${song[0].url}]`);
    let track = await queue.play(song[0].url).catch(() => {
      if (!guildQueue) {
        queue.stop();
      }
    });
  },
};

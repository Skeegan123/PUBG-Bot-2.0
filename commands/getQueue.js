const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Returns the next 10 songs in the queue"),

  async execute(interaction) {
    await interaction.deferReply();
    let guildQueue = interaction.client.player.getQueue(interaction.guildId);
    if (!guildQueue) {
      return await interaction.editReply("There is no music in the queue!");
    }
    let queue = guildQueue.songs;
    let queueString = "";
    let counter = 0;
    console.log(queue);
    while (counter < 10 && counter < queue.length) {
      queueString += `${counter + 1}. ${queue[counter].name}\n`;
      counter++;
    }
    await interaction.editReply(queueString);
  },
};

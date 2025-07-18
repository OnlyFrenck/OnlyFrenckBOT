const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: 'Puoi eseguire questo comando solo in un server.',
        ephemeral: true,
      });
      return;
    }

    const targetUserId = interaction.options.get('user')?.value || interaction.member.id;

    await interaction.deferReply();

    const user = await User.findOne({ userId: targetUserId, guildId: interaction.guild.id });

    if (!user) {
      interaction.editReply(`<@${targetUserId}> non ha ancora un profilo.`);
      return;
    }

    interaction.editReply(
      targetUserId === interaction.member.id
        ? `Il tuo saldo è di **${user.balance}**`
        : `Il saldo di <@${targetUserId}> ammonta a **${user.balance}**`
    );
  },

  name: 'balance',
  description: "Vedi il saldo di un utente.",
  options: [
    {
      name: 'user',
      description: 'L\'utente di cui vuoi vedere il saldo.',
      type: ApplicationCommandOptionType.User,
    },
  ],
};
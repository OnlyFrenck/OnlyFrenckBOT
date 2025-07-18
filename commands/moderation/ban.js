const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get('user').value;
    const reason =
      interaction.options.get('reason')?.value || 'Nessuna motivazione fornita.';

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("L'utente non fa parte del server.");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "Non puoi bannare <@1159513992860020806> perché è l'owner del server."
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "Non puoi bannare l'utente perché ha un ruolo maggiore al tuo."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "Non posso bannare l'utente perché ha un ruolo maggiore al mio."
      );
      return;
    }

    // Ban the targetUser
    try {
      await targetUser.ban({ reason });
      await interaction.editReply(
        `L'utente ${targetUser} è stato bannato\nMotivo: ${reason}`
      );
    } catch (error) {
      console.log(`C'è stato un errore nel banning: ${error}`);
    }
  },

  name: 'ban',
  description: 'Banna un membro dal server.',
  options: [
    {
      name: 'user',
      description: 'Utente da bannare.',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: 'reason',
      description: 'Motivazione del ban.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
};
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
        "Non puoi espellere <@1159513992860020806> perché è l'owner del server."
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "Non puoi espellere l'utente perché ha un ruolo maggiore al tuo."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "Non posso espellere l'utente perché ha un ruolo maggiore al mio."
      );
      return;
    }

    // Ban the targetUser
    try {
      await targetUser.ban({ reason });
      await interaction.editReply(
        `L'utente ${targetUser} è stato espulso\nMotivo: ${reason}`
      );
    } catch (error) {
      console.log(`C'è stato un errore durante l'espulsione: ${error}`);
    }
  },

  name: 'kick',
  description: 'Espelli un membro dal server.',
  options: [
    {
      name: 'user',
      description: 'Utente da espellere.',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: 'reason',
      description: 'Motivazione del kick.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],
};
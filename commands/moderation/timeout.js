const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const mentionable = interaction.options.get('user').value;
    const duration = interaction.options.get('duration').value; // 1d, 1 day, 1s 5s, 5m
    const reason = interaction.options.get('reason')?.value || 'Nessuna motivazione fornita.';

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.editReply("L'utente non è presente nel server.");
      return;
    }

    if (targetUser.user.bot) {
      await interaction.editReply("Non posso mettere in timeout un bot.");
      return;
    }

    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.editReply('Per favore, fornisci una durata valida per il timeout.');
      return;
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply('Il timeout deve essere tra 5sec e 28gg.');
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("Non puoi mettere in timeout questo utente perché ha un ruolo più alto di te.");
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("Non posso mettere in timeout questo utente perché ha un ruolo più alto di me.");
      return;
    }

    // Timeout the user
    try {
      const { default: prettyMs } = await import('pretty-ms');

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await interaction.editReply(`Il timeout di ${targetUser} è stato aggiornato a ${prettyMs(msDuration, { verbose: true })}\nMotivazione: ${reason}`);
        return;
      }

      await targetUser.timeout(msDuration, reason);
      await interaction.editReply(`${targetUser} was timed out for ${prettyMs(msDuration, { verbose: true })}.\nReason: ${reason}`);
    } catch (error) {
      console.log(`C'è stato un errore nel timeout: ${error}`);
    }
  },

  name: 'timeout',
  description: 'Metti in timeout un utente.',
  options: [
    {
      name: 'user',
      description: 'L\'utente che vuoi mettere in timeout.',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: 'duration',
      description: 'Durata del timeout (30m, 1h, 1gg).',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'reason',
      description: 'Motivazione del timeout timeout.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],
};
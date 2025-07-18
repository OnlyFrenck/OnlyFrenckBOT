const { Client, Interaction, PermissionFlagsBits } = require('discord.js');
const AutoRole = require('../../models/AutoRole');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();

      if (!(await AutoRole.exists({ guildId: interaction.guild.id }))) {
        interaction.editReply('L\'autorole è stato disabilitato per questo server. Esegui `/autorole-configure` per abilitarlo.');
        return;
      }

      await AutoRole.findOneAndDelete({ guildId: interaction.guild.id });
      interaction.editReply('L\'autorole è stato disabilitato per questo server. Esegui `/autorole-configure` per abilitarlo di nuovo.');
    } catch (error) {
      console.log(error);
    }
  },

  name: 'autorole-disable',
  description: 'Disabilita l\'autorole per il server.',
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
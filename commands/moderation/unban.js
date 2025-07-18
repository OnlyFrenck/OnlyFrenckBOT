const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  /**
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.options.getString("userid");

    try {
      // Prova a recuperare la lista ban
      const ban = await interaction.guild.bans.fetch(userId);
      if (!ban) {
        return interaction.editReply("❌ Questo utente non è bannato.");
      }

      await interaction.guild.bans.remove(userId);
      interaction.editReply(`✅ Utente con ID \`${userId}\` è stato sbannato con successo!`);
    } catch (error) {
      console.error(error);
      interaction.editReply("❌ Impossibile sbannare questo utente. Controlla l'ID e i permessi.");
    }
  },

  name: "unban",
  description: "Rimuove il ban di un utente tramite ID",
  options: [
    {
      name: "userid",
      description: "ID dell'utente da sbannare",
      type: 3, // STRING
      required: true
    }
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers]
};
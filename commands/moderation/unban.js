const { PermissionFlagsBits } = require("discord.js");

module.exports = {
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
  botPermissions: [PermissionFlagsBits.BanMembers],

  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.options.getString("userid");

    try {
      // Prova a prendere il ban, se non esiste genera errore
      await interaction.guild.bans.fetch(userId);
    } catch (error) {
      return interaction.editReply("❌ Questo utente non è bannato o ID non valido.");
    }

    try {
      await interaction.guild.bans.remove(userId);
      return interaction.editReply(`✅ Utente con ID \`${userId}\` è stato sbannato con successo!`);
    } catch (error) {
      console.error(error);
      return interaction.editReply("❌ Impossibile sbannare questo utente. Controlla i permessi e la gerarchia.");
    }
  }
};
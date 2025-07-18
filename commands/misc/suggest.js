const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

// ID del canale dove vuoi ricevere i suggerimenti
const SUGGESTION_CHANNEL_ID = "123456789012345678"; // sostituisci con il tuo ID

module.exports = {
  name: "suggest",
  description: "Invia un suggerimento allo staff",
  options: [
    {
      name: "testo",
      description: "Il tuo suggerimento",
      type: 3, // STRING
      required: true,
    },
  ],
  permissionsRequired: [], // nessun permesso necessario
  botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.AddReactions],

  /**
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const suggestion = interaction.options.getString("testo");
    const suggestionChannel = interaction.guild.channels.cache.get(SUGGESTION_CHANNEL_ID);

    if (!suggestionChannel) {
      return interaction.editReply("❌ Canale suggerimenti non trovato. Contatta un amministratore.");
    }

    const embed = new EmbedBuilder()
      .setTitle("📩 Nuovo suggerimento")
      .setDescription(suggestion)
      .setColor("#00FF00")
      .setFooter({ text: `Suggerito da ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    try {
      const sentMessage = await suggestionChannel.send({ embeds: [embed] });
      await sentMessage.react("👍");
      await sentMessage.react("👎");

      await interaction.editReply("✅ Grazie per il tuo suggerimento! Lo staff lo valuterà.");
    } catch (error) {
      console.error(error);
      await interaction.editReply("❌ Errore durante l'invio del suggerimento. Riprova più tardi.");
    }
  },
};
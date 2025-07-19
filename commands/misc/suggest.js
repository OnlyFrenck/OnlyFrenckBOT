const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

// ID del canale principale e del canale secondario
const SUGGESTION_CHANNEL_ID = "1274037192469254246"; // canale principale
const LOG_CHANNEL_ID = "1274037456748154961"; // canale secondario, es. log o staff

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
  permissionsRequired: [],
  botPermissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.AddReactions,
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const suggestion = interaction.options.getString("testo");
    const suggestionChannel = interaction.guild.channels.cache.get(SUGGESTION_CHANNEL_ID);
    const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);

    if (!suggestionChannel) {
      return interaction.editReply("❌ Canale suggerimenti non trovato. Contatta un amministratore.");
    }
    if (!logChannel) {
      return interaction.editReply("❌ Canale log non trovato. Contatta un amministratore.");
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

      await logChannel.send({ embeds: [embed] });

      await interaction.editReply("✅ Grazie per il tuo suggerimento! Lo staff lo valuterà.");
    } catch (error) {
      console.error(error);
      await interaction.editReply("❌ Errore durante l'invio del suggerimento. Riprova più tardi.");
    }
  },
};
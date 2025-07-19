const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const Avviso = require("../../models/Avviso.js");

module.exports = {
  name: "avviso",
  description: "Invia un avviso in un canale specifico",
  options: [
    {
      name: "canale",
      description: "Il canale dove inviare l'avviso",
      type: 7, // CHANNEL
      required: true,
    },
    {
      name: "titolo",
      description: "Titolo dell'avviso",
      type: 3,
      required: true,
    },
    {
      name: "descrizione",
      description: "Testo dell'avviso",
      type: 3,
      required: true,
    },
    {
      name: "tag",
      description: "Menzione utente o ruolo (opzionale)",
      type: 9, // MENTIONABLE
      required: false,
    }
  ],
  permissionsRequired: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.SendMessages],

  /**
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const canale = interaction.options.getChannel("canale");
    const titolo = interaction.options.getString("titolo");
    const descrizione = interaction.options.getString("descrizione");
    const tag = interaction.options.getMentionable("tag");

    // Controllo permessi del bot
    const botMember = interaction.guild.members.me;
    const permissions = canale.permissionsFor(botMember);
    if (!permissions.has(PermissionFlagsBits.SendMessages)) {
      return interaction.editReply("❌ Non ho il permesso di scrivere in quel canale.");
    }

    const embed = new EmbedBuilder()
      .setTitle(titolo)
      .setDescription(descrizione)
      .setColor("Yellow")
      .setFooter({ text: `Avviso inviato da ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    try {
      await canale.send({
        content: tag ? `${tag}` : null,
        embeds: [embed],
      });

      await interaction.editReply(`✅ Avviso inviato in ${canale}`);
    } catch (err) {
      console.error(err);
      await interaction.editReply("❌ Errore durante l'invio dell'avviso.");
    }
    const Avviso = require("../../models/Avviso");

    try {
    await Avviso.create({
        guildId: interaction.guild.id,
        channelId: canale.id,
        userId: interaction.user.id,
        title: titolo,
        description: descrizione,
        tag: tag ? tag.toString() : null
    });
    console.log("✅ Avviso salvato nel database.");
    } catch (err) {
    console.error("❌ Errore salvataggio MongoDB:", err);
    }
  }
};
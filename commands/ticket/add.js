const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const Ticket = require("../../models/Ticket");

module.exports = {
    /**
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").Interaction} interaction 
     */
    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const ticket = await Ticket.findOne({ channelId: interaction.channel.id });
        if (!ticket) {
            return interaction.editReply("❌ Questo comando può essere usato solo nei canali ticket.");
        }

        const user = interaction.options.getUser("utente");
        const channel = interaction.channel;

        const overwrite = channel.permissionOverwrites.cache.get(user.id);
        if (overwrite && overwrite.allow.has(PermissionFlagsBits.ViewChannel)) {
            return interaction.editReply("⚠️ Questo utente ha già accesso al ticket.");
        }

        await channel.permissionOverwrites.edit(user.id, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true
        });

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("👤 Utente aggiunto al ticket")
            .setDescription(`<@${user.id}> è stato aggiunto a questo ticket da <@${interaction.user.id}>.`)
            .setTimestamp();

        await channel.send({ embeds: [embed] });
        await interaction.editReply(`✅ Utente aggiunto correttamente: <@${user.id}>`);
    },

    name: "add",
    description: "Aggiungi un utente al ticket",
    options: [
        {
            name: "utente",
            description: "Utente da aggiungere",
            type: 6, // USER
            required: true
        }
    ],
    permissionsRequired: [PermissionFlagsBits.ManageChannels],
    botPermissions: [PermissionFlagsBits.ManageChannels]
};
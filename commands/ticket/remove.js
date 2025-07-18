const { PermissionFlagsBits } = require("discord.js");
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
        if (!overwrite) {
            return interaction.editReply("⚠️ Questo utente non ha accesso al ticket.");
        }

        await channel.permissionOverwrites.delete(user.id);
        await interaction.editReply(`✅ <@${user.id}> è stato rimosso dal ticket.`);
    },

    name: "remove",
    description: "Rimuovi un utente dal ticket",
    options: [
        {
            name: "utente",
            description: "Utente da rimuovere",
            type: 6, // USER
            required: true
        }
    ],
    permissionsRequired: [PermissionFlagsBits.ManageChannels],
    botPermissions: [PermissionFlagsBits.ManageChannels]
}

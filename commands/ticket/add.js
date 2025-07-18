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

        const hasPermission = channel.permissionOverwrites.cache.get(user.id);
        if (hasPermission) {
            return interaction.editReply("⚠️ Questo utente ha già accesso al ticket.");
        }

        await channel.permissionOverwrites.edit(user.id, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true
        });

        await interaction.editReply(`✅ <@${user.id}> è stato aggiunto a questo ticket.`);
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
}

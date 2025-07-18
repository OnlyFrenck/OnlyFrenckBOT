const { PermissionFlagsBits } = require("discord.js");
const Ticket = require("../../models/Ticket");
const closeTicket = require("../../utils/closeTicket");

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").Interaction} interaction 
     */
    callback: async (client, interaction) => {
        console.log("ID canale per chiusura:", interaction.channel.id);
        const ticket = await Ticket.findOne({ channelId: interaction.channel.id });
        console.log("Ticket trovato:", ticket);

        if (!ticket) {
            return interaction.reply("❌ Questo comando può essere usato solo in un canale ticket.");
        }

        await closeTicket(interaction);
    },

    name: 'close',
    description: 'Chiude il ticket corrente',
    
    permissionsRequired: [PermissionFlagsBits.SendMessages],
    botPermissions: [
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.ViewChannel
    ]
}
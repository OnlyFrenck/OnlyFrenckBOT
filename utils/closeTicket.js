const Ticket = require("../models/Ticket");
const { ticketLogChannelId } = require("../config.json");

module.exports = async (interaction) => {
    const channel = interaction.channel;
    const ticket = await Ticket.findOne({ channelId: channel.id });
    if (!ticket) return;

    // Log chiusura ticket
    const logChannel = await interaction.guild.channels.fetch(ticketLogChannelId).catch(() => null);
    if (logChannel) {
        logChannel.send({
            embeds: [
                {
                    title: "📤 Ticket Chiuso",
                    color: 0xED4245,
                    fields: [
                        { name: "Utente", value: `<@${ticket.userId}>` },
                        { name: "Canale", value: `#${channel.name}` },
                        { name: "Chiuso da", value: `<@${interaction.user.id}>` },
                        { name: "Data", value: `<t:${Math.floor(Date.now() / 1000)}:F>` }
                    ]
                }
            ]
        });
    }

    await Ticket.deleteOne({ channelId: channel.id });
    await channel.delete();
};
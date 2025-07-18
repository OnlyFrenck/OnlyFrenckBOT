const Ticket = require('../models/Ticket');

module.exports = async function closeTicket(interaction) {
    const ticket = await Ticket.findOne({ channelId: interaction.channel.id });

    if (!ticket) {
        return interaction.reply({ content: "❌ Questo canale non è un ticket valido.", ephemeral: true });
    }

    await Ticket.deleteOne({ _id: ticket._id });

    await interaction.reply("✅ Ticket chiuso. Il canale sarà eliminato tra 5 secondi.");

    setTimeout(() => {
        interaction.channel.delete().catch(console.error);
    }, 5000);
}
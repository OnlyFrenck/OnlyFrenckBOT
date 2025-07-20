const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const Ticket = require("../../models/Ticket");
const closeTicket = require("../../utils/closeTicket");

module.exports = {
    /**
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").Interaction} interaction 
     */
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true });

            const ticket = await Ticket.findOne({ channelId: interaction.channel.id });

            if (!ticket) {
                return interaction.editReply("❌ Questo comando può essere usato solo in un canale ticket.");
            }

            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("🔒 Ticket chiuso")
                .setDescription(`Il ticket è stato chiuso da <@${interaction.user.id}>.`)
                .setTimestamp();

            await interaction.channel.send({ embeds: [embed] });

            await interaction.editReply("✅ Chiusura in corso...");
            await closeTicket(interaction);

        } catch (err) {
            console.error("Errore nel comando /close:", err);
            if (!interaction.replied) {
                await interaction.reply({ content: "❌ Errore durante la chiusura del ticket.", ephemeral: true });
            }
        }
    },

    name: 'close',
    description: 'Chiude il ticket corrente',
    
    permissionsRequired: [PermissionFlagsBits.SendMessages],
    botPermissions: [
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.ViewChannel
    ]
};
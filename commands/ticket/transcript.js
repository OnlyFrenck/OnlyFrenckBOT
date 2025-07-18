const { AttachmentBuilder, PermissionFlagsBits } = require("discord.js");
const Ticket = require("../../models/Ticket");
const fs = require("fs");
const path = require("path");

module.exports = {
    /**
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const ticket = await Ticket.findOne({ channelId: interaction.channel.id });
        if (!ticket) {
            return interaction.editReply("❌ Questo comando può essere usato solo nei canali ticket.");
        }

        const messages = await interaction.channel.messages.fetch({ limit: 100 });
        const sorted = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

        const transcriptLines = sorted.map(msg => {
            const time = msg.createdAt.toLocaleString("it-IT");
            return `[${time}] ${msg.author.tag}: ${msg.content}`;
        });

        const transcriptText = transcriptLines.join("\n");
        const filePath = path.join(__dirname, `../../temp/transcript-${interaction.channel.id}.txt`);

        fs.writeFileSync(filePath, transcriptText);

        const attachment = new AttachmentBuilder(filePath);
        await interaction.editReply({
            content: "📄 Transcript esportato con successo:",
            files: [attachment]
        });

        fs.unlinkSync(filePath); // elimina file dopo l'invio
    },

    name: "transcript",
    description: "Esporta i messaggi del ticket in un file di testo",
    permissionsRequired: [PermissionFlagsBits.ManageChannels],
    botPermissions: [PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
}
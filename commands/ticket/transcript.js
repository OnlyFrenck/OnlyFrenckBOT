const { AttachmentBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const Ticket = require("../../models/Ticket");
const fs = require("fs");
const path = require("path");

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

        try {
            // Fetch fino a 100 messaggi recenti, ordina dal più vecchio al più nuovo
            const messages = await interaction.channel.messages.fetch({ limit: 100 });
            const sorted = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

            // Crea le righe del transcript con timestamp, autore e contenuto
            const transcriptLines = sorted.map(msg => {
                const time = msg.createdAt.toLocaleString("it-IT");
                const content = msg.content || "[Messaggio senza testo]";
                return `[${time}] ${msg.author.tag}: ${content}`;
            });

            const transcriptText = transcriptLines.join("\n");
            const filePath = path.join(__dirname, `../../temp/transcript-${interaction.channel.id}.txt`);

            // Scrivi il file in modo sincrono (va bene per pochi dati)
            fs.writeFileSync(filePath, transcriptText);

            const attachment = new AttachmentBuilder(filePath);

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("📄 Transcript Ticket")
                .setDescription("Ecco il file di testo con gli ultimi messaggi del ticket.")
                .setTimestamp();

            await interaction.editReply({
                embeds: [embed],
                files: [attachment]
            });

            // Rimuovi il file temporaneo dopo l'invio
            fs.unlinkSync(filePath);

        } catch (error) {
            console.error("Errore durante il transcript:", error);
            return interaction.editReply("❌ Si è verificato un errore durante l'esportazione del transcript.");
        }
    },

    name: "transcript",
    description: "Esporta i messaggi del ticket in un file di testo",
    permissionsRequired: [PermissionFlagsBits.ManageChannels],
    botPermissions: [PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
};
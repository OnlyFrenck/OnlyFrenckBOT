const { PermissionFlagsBits } = require("discord.js");
const Warn = require("../../models/Warn");

module.exports = {
    /**
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").Interaction} interaction 
     */
    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const user = interaction.options.getUser("utente");
        const reason = interaction.options.getString("motivo") || "Nessun motivo specificato";
        const guildId = interaction.guild.id;

        // Salva warning
        const warn = await Warn.create({
            userId: user.id,
            guildId,
            moderatorId: interaction.user.id,
            reason
        });

        // Notifica staff in chat
        await interaction.editReply(`⚠️ <@${user.id}> è stato avvisato per: **${reason}**`);

        // Notifica utente via DM (se possibile)
        try {
            await user.send(`Sei stato avvisato su **${interaction.guild.name}** per: ${reason}`);
        } catch {
            // Ignora errori se non si può inviare DM
        }
    },

    name: "warn",
    description: "Avvisa un utente con un motivo",
    options: [
        {
            name: "utente",
            description: "Utente da avvisare",
            type: 6, // USER
            required: true
        },
        {
            name: "motivo",
            description: "Motivo del warning",
            type: 3, // STRING
            required: false
        }
    ],
    permissionsRequired: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.SendMessages]
}
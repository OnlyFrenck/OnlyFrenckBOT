const { PermissionFlagsBits } = require("discord.js");
const Notification = require("../../models/Notification"); // Assicurati che esista

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").Interaction} interaction 
     */
    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const platform = interaction.options.getString('piattaforma') || 'tutte';

        const filter = platform === 'tutte' ? {} : { type: platform };

        const results = await Notification.find(filter)
            .sort({ postedAt: -1 })
            .limit(5);

        if (results.length === 0) {
            return interaction.editReply('❌ Nessuna notifica trovata.');
        }

        const msg = results.map(n => {
            const emoji = n.subtype === 'live' ? '🔴 LIVE' : '🎥 Video';
            return `**${emoji} ${n.title}**\nCanale: **${n.channelName}**\n➡️ ${n.url}`;
        }).join('\n\n');

        await interaction.editReply({ content: msg });
    },

    name: 'notifiche',
    description: 'Mostra le ultime notifiche video/live da YouTube e Twitch',

    options: [
        {
            name: 'piattaforma',
            description: 'Filtra per YouTube, Twitch o tutte',
            type: 3, // STRING
            required: false,
            choices: [
                { name: 'Tutte', value: 'tutte' },
                { name: 'YouTube', value: 'youtube' },
                { name: 'Twitch', value: 'twitch' }
            ]
        }
    ],

    permissionsRequired: [PermissionFlagsBits.SendMessages],
    botPermissions: [PermissionFlagsBits.SendMessages]
};
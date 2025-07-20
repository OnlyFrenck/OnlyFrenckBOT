const { PermissionFlagsBits, ChannelType } = require('discord.js');
const config = require('../../config/server/channels.json');

const LOG_CHANNEL_ID = config.categoriaStaff.log.id; // ← Sostituisci con l'ID del tuo canale log

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const amount = interaction.options.getInteger('quantità');

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                content: '❌ Non hai il permesso per cancellare i messaggi.',
                ephemeral: true
            });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                content: '❌ Non ho il permesso per cancellare i messaggi.',
                ephemeral: true
            });
        }

        try {
            const messages = await interaction.channel.bulkDelete(amount, true);

            await interaction.reply({
                content: `✅ Ho cancellato ${messages.size} messaggi.`,
                ephemeral: true
            });

            // Log
            const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
            if (logChannel && logChannel.type === ChannelType.GuildText) {
                await logChannel.send({
                    embeds: [
                        {
                            title: '🧹 Messaggi Cancellati',
                            color: 0xffcc00,
                            fields: [
                                { name: 'Moderatore', value: `<@${interaction.user.id}>`, inline: true },
                                { name: 'Quantità', value: `${messages.size}`, inline: true },
                                { name: 'Canale', value: `<#${interaction.channel.id}>`, inline: true }
                            ],
                            timestamp: new Date().toISOString()
                        }
                    ]
                });
            }

        } catch (error) {
            console.error("Errore nel comando /clear:", error);
            await interaction.reply({
                content: '❌ Errore: non posso cancellare messaggi più vecchi di 14 giorni.',
                ephemeral: true
            });
        }
    },

    name: 'clear',
    description: 'Cancella un numero di messaggi nel canale',
    options: [
        {
            name: 'quantità',
            description: 'Numero di messaggi da cancellare (1-100)',
            type: 4, // INTEGER
            required: true
        }
    ],
    permissionsRequired: [PermissionFlagsBits.ManageMessages],
    botPermissions: [PermissionFlagsBits.ManageMessages]
};
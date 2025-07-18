const { PermissionFlagsBits, ChannelType } = require("discord.js");
const Ticket = require("../../models/Ticket");

// Inserisci qui l'ID della categoria dei ticket
const TICKET_CATEGORY_ID = "1275462731490918512";

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").Interaction} interaction 
     */
    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const existingTicket = await Ticket.findOne({
            userId: interaction.user.id,
            guildId: interaction.guild.id
        });

        if (existingTicket) {
            return interaction.editReply(`Hai già un ticket aperto: <#${existingTicket.channelId}>`);
        }

        const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: TICKET_CATEGORY_ID,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ],
                },
                {
                    id: client.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ManageChannels
                    ],
                },
                ...[
                    "1274287335722319945",
                    "1274287998787129395",
                    "1274306704556949554",
                    "1274735453416984690"
                ].map(roleId => ({
                    id: roleId,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                }))
            ]
        });

        console.log("ID canale creato:", ticketChannel.id);

        try {
        const savedTicket = await Ticket.create({
            userId: interaction.user.id,
            channelId: ticketChannel.id,
            guildId: interaction.guild.id,
            createdAt: new Date()
        });
        console.log("Ticket salvato su DB:", savedTicket);
        } catch (err) {
        console.error("Errore salvataggio ticket:", err);
        }

        await ticketChannel.send({
            content: `🎫 Ciao <@${interaction.user.id}>! Un membro dello staff ti risponderà presto.`,
        });

        await interaction.editReply(`✅ Ticket creato correttamente: ${ticketChannel}`);
    },

    name: 'ticket',
    description: 'Apri un ticket di supporto con lo staff',
    
    permissionsRequired: [PermissionFlagsBits.SendMessages],
    botPermissions: [
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.ViewChannel
    ]
}
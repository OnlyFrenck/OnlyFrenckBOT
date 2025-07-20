const { PermissionFlagsBits, ChannelType } = require("discord.js");
const Ticket = require("../../models/Ticket");
const config = require("../../config/server/categories.json");

// Ticket templates definiti come sopra
const ticketTemplates = {
  supporto: {
    name: "supporto-tecnico",
    description: "Ticket per problemi tecnici",
    message: "🎫 Ciao! Il team di supporto tecnico ti risponderà presto. Spiega il problema dettagliatamente."
  },
  reclamo: {
    name: "reclamo",
    description: "Ticket per segnalare un reclamo",
    message: "⚠️ Hai aperto un ticket reclamo. Il team prenderà in carico la tua segnalazione al più presto."
  },
  domanda: {
    name: "domanda-generale",
    description: "Ticket per domande generiche",
    message: "💡 Hai una domanda? Il nostro staff ti risponderà appena possibile."
  }
};

const TICKET_CATEGORY_ID = config.assistenza.id; // ID della categoria dei ticket

module.exports = {
  name: 'ticket',
  description: 'Apri un ticket di supporto con lo staff',
  options: [
    {
      name: "template",
      description: "Seleziona il tipo di ticket",
      type: 3, // STRING
      required: true,
      choices: Object.keys(ticketTemplates).map(key => ({
        name: ticketTemplates[key].description,
        value: key
      }))
    }
  ],
  permissionsRequired: [PermissionFlagsBits.SendMessages],
  botPermissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.ViewChannel
  ],
  
  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });
    
    const templateKey = interaction.options.getString("template");
    const template = ticketTemplates[templateKey];
    if (!template) {
      return interaction.editReply("❌ Template non valido.");
    }

    // Controlla ticket esistente
    const existingTicket = await Ticket.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id
    });

    if (existingTicket) {
      return interaction.editReply(`Hai già un ticket aperto: <#${existingTicket.channelId}>`);
    }

    // Crea canale con nome template.name
    const ticketChannel = await interaction.guild.channels.create({
      name: `${template.name}-${interaction.user.username}`,
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
        ...[ // ruoli staff da aggiornare con i tuoi
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

    // Salva ticket DB
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

    // Invia messaggio iniziale personalizzato
    await ticketChannel.send({
      content: template.message.replace("{user}", `<@${interaction.user.id}>`),
    });

    await interaction.editReply(`✅ Ticket creato correttamente: ${ticketChannel}`);

    const logChannel = await interaction.guild.channels.fetch(ticketLogChannelId).catch(() => null);
    if (logChannel) {
        logChannel.send({
            embeds: [
                {
                    title: "📥 Nuovo Ticket Aperto",
                    color: 0x57F287,
                    fields: [
                        { name: "Utente", value: `<@${interaction.user.id}> (${interaction.user.tag})` },
                        { name: "Canale", value: `<#${ticketChannel.id}>` },
                        { name: "Data", value: `<t:${Math.floor(Date.now() / 1000)}:F>` }
                    ]
                }
            ]
        });
    }
  }
};
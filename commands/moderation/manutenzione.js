const fs = require('fs');
const path = require('path');
const { devs } = require('../../config.json');

const maintenanceFile = path.join(__dirname, '..', '..', 'config', 'server', 'maintenance.json');

function saveMaintenance(data) {
  fs.writeFileSync(maintenanceFile, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
  name: 'manutenzione',
  description: 'Gestisci la modalità manutenzione di bot o server',
  devOnly: true,
  options: [
    {
      type: 3, // string
      name: 'target',
      description: 'Scegli se gestire manutenzione bot o server',
      required: true,
      choices: [
        { name: 'bot', value: 'bot' },
        { name: 'server', value: 'server' }
      ]
    },
    {
      type: 3, // string
      name: 'azione',
      description: 'on | off | messaggio | whitelist',
      required: true,
      choices: [
        { name: 'on', value: 'on' },
        { name: 'off', value: 'off' },
        { name: 'messaggio', value: 'messaggio' },
        { name: 'whitelist', value: 'whitelist' }
      ]
    },
    {
      type: 3, // string
      name: 'valore',
      description: 'Valore per messaggio o whitelist (aggiungi/rimuovi user ID)',
      required: false
    }
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const target = interaction.options.getString('target');
    const action = interaction.options.getString('azione');
    const value = interaction.options.getString('valore');

    // Carichiamo o inizializziamo manutenzione
    let maintenance = {
      bot: {
        enabled: false,
        message: '',
        whitelist: []
      },
      servers: {}  // { guildId: { enabled, message, whitelist } }
    };

    try {
      const raw = fs.readFileSync(maintenanceFile, 'utf8');
      maintenance = JSON.parse(raw);
    } catch {}

    if (target === 'bot') {
      // Target = bot
      switch (action) {
        case 'on':
          maintenance.bot.enabled = true;
          saveMaintenance(maintenance);
          return interaction.editReply('🟢 Modalità manutenzione BOT attivata.');

        case 'off':
          maintenance.bot.enabled = false;
          saveMaintenance(maintenance);
          return interaction.editReply('🔴 Modalità manutenzione BOT disattivata.');

        case 'messaggio':
          if (!value) return interaction.editReply('Devi specificare un messaggio.');
          maintenance.bot.message = value;
          saveMaintenance(maintenance);
          return interaction.editReply(`Messaggio manutenzione BOT aggiornato:\n> ${value}`);

        case 'whitelist':
          if (!value) return interaction.editReply('Devi specificare un ID utente da aggiungere o rimuovere.');
          if (maintenance.bot.whitelist.includes(value)) {
            maintenance.bot.whitelist = maintenance.bot.whitelist.filter(id => id !== value);
            saveMaintenance(maintenance);
            return interaction.editReply(`Utente <@${value}> rimosso dalla whitelist BOT.`);
          } else {
            maintenance.bot.whitelist.push(value);
            saveMaintenance(maintenance);
            return interaction.editReply(`Utente <@${value}> aggiunto alla whitelist BOT.`);
          }

        default:
          return interaction.editReply('Azione non riconosciuta.');
      }
    } else if (target === 'server') {
      // Target = singolo server
      const guildId = interaction.guildId;
      if (!guildId) return interaction.editReply('Questo comando deve essere usato in un server.');

      if (!maintenance.servers[guildId]) {
        maintenance.servers[guildId] = {
          enabled: false,
          message: '',
          whitelist: []
        };
      }

      switch (action) {
        case 'on':
          maintenance.servers[guildId].enabled = true;
          saveMaintenance(maintenance);
          return interaction.editReply(`🟢 Modalità manutenzione SERVER attivata per questo server.`);

        case 'off':
          maintenance.servers[guildId].enabled = false;
          saveMaintenance(maintenance);
          return interaction.editReply(`🔴 Modalità manutenzione SERVER disattivata per questo server.`);

        case 'messaggio':
          if (!value) return interaction.editReply('Devi specificare un messaggio.');
          maintenance.servers[guildId].message = value;
          saveMaintenance(maintenance);
          return interaction.editReply(`Messaggio manutenzione SERVER aggiornato per questo server:\n> ${value}`);

        case 'whitelist':
          if (!value) return interaction.editReply('Devi specificare un ID utente da aggiungere o rimuovere.');
          if (maintenance.servers[guildId].whitelist.includes(value)) {
            maintenance.servers[guildId].whitelist = maintenance.servers[guildId].whitelist.filter(id => id !== value);
            saveMaintenance(maintenance);
            return interaction.editReply(`Utente <@${value}> rimosso dalla whitelist SERVER.`);
          } else {
            maintenance.servers[guildId].whitelist.push(value);
            saveMaintenance(maintenance);
            return interaction.editReply(`Utente <@${value}> aggiunto alla whitelist SERVER.`);
          }

        default:
          return interaction.editReply('Azione non riconosciuta.');
      }
    } else {
      return interaction.editReply('Target non valido.');
    }
  }
};
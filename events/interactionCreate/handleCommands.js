const { devs, testServer } = require('../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');
const fs = require('fs');
const path = require('path');

const maintenanceFile = path.join(__dirname, '..', '..', 'config', 'server', 'maintenance.json');

let maintenance = {
  bot: { enabled: false, message: '', whitelist: [] },
  servers: {}
};

function loadMaintenance() {
  try {
    const raw = fs.readFileSync(maintenanceFile, 'utf8');
    maintenance = JSON.parse(raw);
  } catch (e) {
    console.log('Maintenance file non trovato o malformato, uso default.');
  }
}
loadMaintenance();

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const userId = interaction.user.id;
  const guildId = interaction.guildId;

  // Ricarica manutenzione ogni volta (opzionale, puoi commentare se vuoi meno I/O)
  loadMaintenance();

  // Controllo manutenzione BOT
  if (maintenance.bot.enabled && !maintenance.bot.whitelist.includes(userId)) {
    return interaction.reply({
      content: maintenance.bot.message || 'Bot in manutenzione, riprova più tardi.',
      ephemeral: true,
    });
  }

  // Controllo manutenzione SERVER (solo se siamo in un server)
  if (
    guildId &&
    maintenance.servers[guildId] &&
    maintenance.servers[guildId].enabled &&
    !maintenance.servers[guildId].whitelist.includes(userId)
  ) {
    return interaction.reply({
      content: maintenance.servers[guildId].message || 'Server in manutenzione, riprova più tardi.',
      ephemeral: true,
    });
  }

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(cmd => cmd.name === interaction.commandName);

    if (!commandObject) return;

    if (commandObject.devOnly) {
      if (!devs.includes(userId)) {
        return interaction.reply({
          content: 'Solo i developer sono ammessi all\'uso di questo comando.',
          ephemeral: true,
        });
      }
    }

    if (commandObject.testOnly) {
      if (!(guildId === testServer)) {
        return interaction.reply({
          content: 'Questo comando non può essere eseguito qui.',
          ephemeral: true,
        });
      }
    }

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          return interaction.reply({
            content: 'I permessi richiesti non sono stati trovati.',
            ephemeral: true,
          });
        }
      }
    }

    if (commandObject.botPermissions?.length) {
      const bot = interaction.guild.members.me;
      for (const permission of commandObject.botPermissions) {
        if (!bot.permissions.has(permission)) {
          return interaction.reply({
            content: "Il bot non ha i permessi richiesti.",
            ephemeral: true,
          });
        }
      }
    }

    await commandObject.callback(client, interaction);

  } catch (error) {
    console.log(`C'è stato un errore nell'esecuzione del comando: ${error}`);
  }
};
require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');
const checkYouTube = require('./utils/checkYouTube');
const path = require('path');
const fs = require('fs');

const config = require('./config/server/channels.json');
const allowedUsers = ['1159513992860020806', '1181360952659148843', '1326249138840666114'];

const maintenanceFile = path.join(__dirname, 'config', 'server', 'maintenance.json');
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

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent,
  ],
});

(async () => {
  try {
    if (maintenance.bot.enabled) {
      console.log('Il bot è in manutenzione. Avvio bloccato.');
    }

    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connesso al database.');

    eventHandler(client);
    checkYouTube(client);
    setInterval(() => checkYouTube(client), 20 * 60 * 1000); // ogni 20 minuti

    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();

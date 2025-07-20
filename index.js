require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');
const checkYouTube = require('./utils/checkYouTube');
const config = require('./config/server/channels.json');

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
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connesso al database.');

    eventHandler(client);

    checkYouTube(client);

    setInterval(() => checkYouTube(client), 20 * 60 * 1000); // Controlla ogni 20 minuti

    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();
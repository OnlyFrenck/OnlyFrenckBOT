require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');
const checkYouTube = require('./utils/checkYouTube');

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

    client.login(process.env.TOKEN);

    checkYouTube(client);

    setInterval(() => checkYouTube(client), 5 * 60 * 1000); // Controlla ogni 5 minuti
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();
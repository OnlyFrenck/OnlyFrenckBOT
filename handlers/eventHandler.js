const path = require('path');
const getAllFiles = require('../utils/getAllFiles');

module.exports = (client) => {
  const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder);
    eventFiles.sort((a, b) => a > b);

    const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();

    client.on(eventName, async (...args) => {
      for (const eventFile of eventFiles) {
        const eventModule = require(eventFile);

        if (typeof eventModule === 'function') {
          await eventModule(client, ...args); // caso 1: esporta una funzione
        } else if (eventModule && typeof eventModule.callback === 'function') {
          await eventModule.callback(client, ...args); // caso 2: esporta { callback: fn }
        } else {
          console.warn(`[WARNING] File evento non valido: ${eventFile}`);
        }
      }
    });
  }
};
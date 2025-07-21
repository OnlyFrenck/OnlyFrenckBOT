const fs = require('fs');
const path = require('path');

const maintenanceFile = path.join(__dirname, '..', 'config', 'server', 'maintenance.json');

function readMaintenanceData() {
  try {
    const raw = fs.readFileSync(maintenanceFile, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Errore lettura maintenance.json:', error);
    return null;
  }
}

/**
 * Verifica lo stato di manutenzione per un determinato server e utente
 * @param {string} guildId - ID del server Discord
 * @param {string} userId - ID utente Discord
 * @returns {{enabled: boolean, message: string}} stato manutenzione e messaggio
 */
function isMaintenanceActive(guildId, userId) {
  const data = readMaintenanceData();
  if (!data) return { enabled: false, message: '' };

  // Controlla manutenzione globale bot
  if (data.bot.enabled && !data.bot.whitelist.includes(userId)) {
    return {
      enabled: true,
      message: data.bot.message || 'Il bot è in manutenzione, riprova più tardi.'
    };
  }

  // Controlla manutenzione server specifico
  if (guildId && data.servers && data.servers[guildId]) {
    const serverMaint = data.servers[guildId];
    if (serverMaint.enabled && !serverMaint.whitelist.includes(userId)) {
      return {
        enabled: true,
        message: serverMaint.message || 'Questo server è in manutenzione, riprova più tardi.'
      };
    }
  }

  // Nessuna manutenzione attiva per utente/server
  return { enabled: false, message: '' };
}

module.exports = {
  isMaintenanceActive
};
const { PermissionsBitField } = require('discord.js');

const badWords = ['porco dio', 'porca madonna', 'puttana madonna', 'vaffanculo', 'fanculo', 'coglione', 'figa', 'bastardo', 'bastarda'];
const bannedDomains = ['onlyfans.com', 'bit.ly', 'pornhub.com', 'xvideos.com', 'redtube.com', 'xhamster.com', 'youjizz.com'];

const warningMap = new Map(); // mappa utenteId -> numero avvisi

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const content = message.content.toLowerCase();

        // Controllo parole vietate
        if (badWords.some(word => content.includes(word))) {
            await message.delete().catch(() => {});
            await message.channel.send(`<@${message.author.id}>, attenzione! Hai usato parole vietate.`);

            incrementWarning(message.author.id, message);
            return;
        }

        // Controllo link vietati
        if (bannedDomains.some(domain => content.includes(domain))) {
            // Permetti ai mod di bypassare il filtro link
            if (message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;

            await message.delete().catch(() => {});
            await message.channel.send(`<@${message.author.id}>, link non permesso nel server.`);

            incrementWarning(message.author.id, message);
            return;
        }

        // Potresti aggiungere qui controllo spam, flood, ecc.
    }
}

function incrementWarning(userId, message) {
    const count = warningMap.get(userId) || 0;
    const newCount = count + 1;
    warningMap.set(userId, newCount);

    if (newCount >= 3) {
        // Qui puoi mettere la logica per mutare o kickare l’utente
        const member = message.guild.members.cache.get(userId);
        if (!member) return;

        // Esempio mute 10 minuti
        member.timeout(10 * 60 * 1000, 'Raggiunto limite avvisi filtro moderazione')
            .then(() => {
                message.channel.send(`<@${userId}> è stato mutato per 10 minuti.`);
            })
            .catch(console.error);

        // Resetta il contatore warning
        warningMap.set(userId, 0);
    }
}
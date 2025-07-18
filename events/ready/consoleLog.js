module.exports = (client) => {
    console.log(`Loggato come ${client.user.tag}`);
    console.log(`Client ID: ${client.user.id}`);
    console.log(`Server attivi: ${client.guilds.cache.size}`);
    console.log(`Pronto alle: ${new Date().toLocaleString()}`);
}
const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").Interaction} interaction  
     */

    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        await interaction.editReply('**Canale Twitch**\nhttps://twitch.tv/onlyfrenck_tw');
    },

    name: 'twitch',
    description: 'Link al mio canale Twitch',
    
    permissionsRequired: [PermissionFlagsBits.SendMessages],
    botPermissions: [PermissionFlagsBits.SendMessages]
}
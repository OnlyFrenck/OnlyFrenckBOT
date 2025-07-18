const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").Interaction} interaction  
     */

    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        await interaction.editReply('**OnlyFrenck**\nhttps://youtube.com/@OfficialOnlyFrenck\n\n**Frenck Fortnite**\nhttps://youtube.com/@FrenckFortnite');
    },

    name: 'youtube',
    description: 'Link ai miei canali YouTube',
    
    permissionsRequired: [PermissionFlagsBits.SendMessages],
    botPermissions: [PermissionFlagsBits.SendMessages]
}
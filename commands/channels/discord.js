const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").Interaction} interaction  
     */

    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        await interaction.editReply('**Server Discord**\n\nhttps://dsc.gg/onlyfrenckcommunity');
    },

    name: 'discord',
    description: 'Link d\'invito al server Discord',
    
    permissionsRequired: [PermissionFlagsBits.SendMessages],
    botPermissions: [PermissionFlagsBits.SendMessages]
}
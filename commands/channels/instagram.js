const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").Interaction} interaction 
     */

    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        await interaction.editReply('**Profilo Instagram**\nhttps://instagram.com/frenck_best');
    },

    name: 'instagram',
    description: 'Link al mio profilo Instagram',

    permissionsRequired: [PermissionFlagsBits.SendMessages],
    botPermissions: [PermissionFlagsBits.SendMessages]
}
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    /**
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const { guild } = interaction;

        const embed = new EmbedBuilder()
            .setTitle(`📊 Info server: ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: "ID Server", value: guild.id, inline: true },
                { name: "Creato il", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
                { name: "Proprietario", value: `<@${guild.ownerId}>`, inline: true },
                { name: "Membri totali", value: `${guild.memberCount}`, inline: true },
                { name: "Canali", value: `${guild.channels.cache.size}`, inline: true },
                { name: "Ruoli", value: `${guild.roles.cache.size}`, inline: true }
            )
            .setColor("Green");

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },

    name: 'serverinfo',
    description: 'Mostra le informazioni del server',

    permissionsRequired: [PermissionFlagsBits.SendMessages],
    botPermissions: [PermissionFlagsBits.SendMessages]
};
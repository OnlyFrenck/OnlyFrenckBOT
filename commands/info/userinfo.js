const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    /**
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        const embed = new EmbedBuilder()
            .setTitle(`👤 Informazioni utente: ${user.username}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "Tag", value: user.tag, inline: true },
                { name: "ID", value: user.id, inline: true },
                { name: "Creato il", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: false },
                { name: "Entrato nel server", value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : "Non disponibile", inline: false },
                { name: "Ruoli", value: member ? member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r.toString()).join(", ") || "Nessun ruolo" : "N/A", inline: false }
            )
            .setColor("Blurple");

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },

    name: 'userinfo',
    description: 'Mostra le informazioni su un utente',
    options: [
        {
            name: 'user',
            description: 'Utente da controllare',
            type: 6, // USER
            required: false
        }
    ],

    permissionsRequired: [PermissionFlagsBits.SendMessages],
    botPermissions: [PermissionFlagsBits.SendMessages]
};
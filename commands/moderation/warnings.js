const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const Warn = require("../../models/Warn");

module.exports = {
    /**
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").Interaction} interaction 
     */
    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const user = interaction.options.getUser("utente");
        const guildId = interaction.guild.id;

        const warns = await Warn.find({ userId: user.id, guildId });

        if (!warns.length) {
            return interaction.editReply(`ℹ️ <@${user.id}> non ha warning.`);
        }

        const embed = new EmbedBuilder()
            .setTitle(`Warning di ${user.tag}`)
            .setColor("Orange")
            .setFooter({ text: `Richiesto da ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        warns.forEach((warn, i) => {
            embed.addFields({
                name: `#${i + 1} - Moderatore: <@${warn.moderatorId}>`,
                value: `Motivo: ${warn.reason}\nData: ${warn.createdAt.toLocaleString("it-IT")}`
            });
        });

        await interaction.editReply({ embeds: [embed] });
    },

    name: "warnings",
    description: "Mostra i warning di un utente",
    options: [
        {
            name: "utente",
            description: "Utente da controllare",
            type: 6, // USER
            required: true
        }
    ],
    permissionsRequired: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.SendMessages]
}
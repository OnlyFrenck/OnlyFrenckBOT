const { Client, GuildMember, EmbedBuilder } = require('discord.js');
const config = require('../../config/server/channels.json');

/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
  try {
    const guild = member.guild;
    if (!guild) return;

    const leaveChannelId = config.categoriaOnlyFrenck.moneboys.id;
    const leaveChannel = guild.channels.cache.get(leaveChannelId);
    if (!leaveChannel) return;

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle('👋 Utente uscito')
      .setDescription(`**${member.user.tag}** ha lasciato il server ed è diventato un mone.`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Membri rimasti: ${guild.memberCount}` })
      .setTimestamp();

    await leaveChannel.send({ embeds: [embed] });

  } catch (error) {
    console.error(`Errore in guildMemberRemove: ${error}`);
  }
};
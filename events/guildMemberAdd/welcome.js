const { Client, GuildMember, EmbedBuilder } = require('discord.js');
const AutoRole = require('../../models/AutoRole');

/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
  try {
    let guild = member.guild;
    if (!guild) return;

    // Assegna automaticamente il ruolo
    const autoRole = await AutoRole.findOne({ guildId: guild.id });
    if (autoRole) {
      await member.roles.add(autoRole.roleId);
    }

    // Canale di benvenuto (puoi settarlo staticamente o dinamicamente)
    const welcomeChannelId = '1274036846648623186'; // Sostituisci con il tuo ID canale
    const welcomeChannel = guild.channels.cache.get(welcomeChannelId);
    if (!welcomeChannel) return;

    // Embed di benvenuto
    const welcomeEmbed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle('🎉 Benvenuto!')
      .setDescription(`Ciao ${member}, benvenuto/a in **${guild.name}**!\nAssicurati di leggere le regole e divertirti!`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Utente #${guild.memberCount}` })
      .setTimestamp();

    await welcomeChannel.send({ embeds: [welcomeEmbed] });

  } catch (error) {
    console.log(`Error in guildMemberAdd event: ${error}`);
  }
};

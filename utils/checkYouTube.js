const axios = require('axios');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const moment = require('moment');
const YouTubeVideo = require('../models/YouTubeVideo');
const channelConfigs = require('../config/youtubeChannels');

const API_KEY = process.env.YT_API_KEY;

module.exports = async (client) => {
  for (const config of channelConfigs) {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${config.channelId}&part=snippet,id&order=date&maxResults=1`
      );

      const [latest] = response.data.items;
      if (!latest || !latest.id) continue;

      const videoId = latest.id.videoId || latest.id.playlistId || latest.id;
      const snippet = latest.snippet;
      const isLive = latest.id.kind === "youtube#video" && snippet.liveBroadcastContent === "live";

      const alreadyNotified = await YouTubeVideo.findOne({ videoId });
      if (alreadyNotified) continue;

      const startTime = moment(snippet.publishedAt);
      const now = moment();
      const duration = moment.duration(now.diff(startTime));
      const elapsed = isLive ? `🕒 Live iniziata **da ${duration.humanize()}**` : '';

      const embed = new EmbedBuilder()
        .setTitle(snippet.title)
        .setURL(`https://www.youtube.com/watch?v=${videoId}`)
        .setThumbnail(snippet.thumbnails.high.url)
        .setDescription(
          `${isLive ? `<@&1274029630961221756> 🔴 **LIVE ora** su **${snippet.channelTitle}!**` : `<@1274029630961221756> 📹 **Nuovo video** su **${snippet.channelTitle}!**`}\n\n` +
          `**Titolo:** ${snippet.title}\n` +
          (elapsed ? `\n${elapsed}` : '')
        )
        .setTimestamp(new Date(snippet.publishedAt))
        .setColor(isLive ? 0xE53935 : 0x1E88E5);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Guarda su YouTube")
          .setStyle(ButtonStyle.Link)
          .setURL(`https://www.youtube.com/watch?v=${videoId}`)
      );

      const discordChannel = client.channels.cache.get(config.discordChannelId);
      if (discordChannel) {
        await discordChannel.send({ embeds: [embed], components: [row] });
      }

      await YouTubeVideo.create({
        videoId,
        title: snippet.title,
        channelTitle: snippet.channelTitle,
        publishedAt: snippet.publishedAt,
        type: isLive ? "live" : "video"
      });

    } catch (err) {
      console.error(`Errore nel check del canale ${config.channelId}:`, err);
    }
  }
};
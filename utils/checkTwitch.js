const axios = require('axios');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const TwitchStream = require('../models/TwitchStream');
const channelConfigs = require('../config/twitchChannels');

const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

let accessToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiresAt) return accessToken;

  try {
    const response = await axios.post(`https://id.twitch.tv/oauth2/token`, null, {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
    });

    accessToken = response.data.access_token;
    tokenExpiresAt = Date.now() + (response.data.expires_in * 1000) - 60000; // 1 min prima scadenza
    return accessToken;
  } catch (err) {
    console.error('Errore fetching Twitch access token:', err);
    return null;
  }
}

module.exports = async (client) => {
  const token = await getAccessToken();
  if (!token) return;

  for (const config of channelConfigs) {
    try {
      // Get stream data
      const response = await axios.get('https://api.twitch.tv/helix/streams', {
        headers: {
          'Client-ID': CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
        params: {
          user_login: config.twitchUserLogin,
        },
      });

      const stream = response.data.data[0];

      if (!stream) {
        // canale offline, niente notifica
        continue;
      }

      // Controlla se è già stato notificato
      const alreadyNotified = await TwitchStream.findOne({ streamId: stream.id });
      if (alreadyNotified) continue;

      const embed = new EmbedBuilder()
        .setTitle(stream.title)
        .setURL(`https://twitch.tv/${config.twitchUserLogin}`)
        .setDescription(`🔴 **${stream.user_name} è in LIVE su Twitch!**`)
        .setImage(stream.thumbnail_url.replace('{width}', '640').replace('{height}', '360') + `?rand=${Date.now()}`)
        .setColor(0x9146FF)
        .setTimestamp(new Date(stream.started_at));

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('Guarda su Twitch')
          .setURL(`https://twitch.tv/${config.twitchUserLogin}`)
          .setStyle(ButtonStyle.Link)
      );

      const discordChannel = client.channels.cache.get(config.discordChannelId);
      if (discordChannel) {
        await discordChannel.send({ embeds: [embed], components: [row] });
      }

      // Salva in DB che abbiamo notificato questo stream
      await TwitchStream.create({
        streamId: stream.id,
        userName: stream.user_name,
        startedAt: stream.started_at,
        notifiedAt: new Date(),
      });

    } catch (err) {
      console.error(`Errore nel check Twitch per ${config.twitchUserLogin}:`, err);
    }
  }
};
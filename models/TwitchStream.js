const mongoose = require('mongoose');

const TwitchStreamSchema = new mongoose.Schema({
  streamId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  startedAt: { type: Date, required: true },
  notifiedAt: { type: Date, required: true },
});

module.exports = mongoose.model('TwitchStream', TwitchStreamSchema);
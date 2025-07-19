const mongoose = require("mongoose");

const AvvisoSchema = new mongoose.Schema({
  guildId: String,
  channelId: String,
  userId: String,
  title: String,
  description: String,
  tag: String,
  sentAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Avviso", AvvisoSchema);
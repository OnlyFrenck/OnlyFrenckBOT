const mongoose = require("mongoose");

const YouTubeContentSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  url: String,
  publishedAt: Date,
  isLive: Boolean,
  notifiedIn: String, // ID canale Discord
  type: String // "video" o "live"
});

module.exports = mongoose.model("YouTubeContent", YouTubeContentSchema);
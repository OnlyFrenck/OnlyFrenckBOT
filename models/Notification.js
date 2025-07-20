const { model, Schema } = require("mongoose");

const notificationSchema = new Schema({
    type: {
        type: String, // 'youtube' o 'twitch'
        required: true
    },
    subtype: {
        type: String, // 'video' o 'live'
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    channelName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    postedAt: {
        type: Date,
        required: true
    }
});

module.exports = model("Notification", notificationSchema);
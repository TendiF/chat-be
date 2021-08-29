const mongoose = require("../mongoose")

const chatSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  room: {
    type: String,
    required: true,
    trim: true,
  },
  created_at: {
    type: Date, 
    default: Date.now
  }
});

const chatModel = mongoose.model('ChatModel', chatSchema);

module.exports = chatModel
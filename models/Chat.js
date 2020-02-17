const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    username: String,
    text: String
  }, {timestamps: true});
  
  const Chat = mongoose.model('Chat', ChatSchema);
  module.exports = {Chat};
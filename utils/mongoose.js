const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017/chatapp', {useNewUrlParser: true});

module.exports = mongoose
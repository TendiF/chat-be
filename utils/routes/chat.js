const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/', function(req, res) {
    chatController.list(req,res);
});

module.exports = router;
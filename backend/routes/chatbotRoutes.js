const express = require("express");
const { queryChatbot } = require("../controller/chatBotController.js");

const router = express.Router();

router.post("/query", queryChatbot);

module.exports = router;

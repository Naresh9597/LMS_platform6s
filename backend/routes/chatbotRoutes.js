const express = require("express");
const { queryChatbot } = require("../controller/chatbotController.js");

const router = express.Router();

router.post("/query", queryChatbot);

module.exports = router; // ✅ CommonJS export

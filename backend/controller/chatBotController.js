const { matchChatIntent, datasetFor } = require("../data/mockdata");

const queryChatbot = (req, res) => {
  const { role, text } = req.body;
  if (!role || !text) return res.status(400).json({ error: "Missing role or text" });

  const intent = matchChatIntent(role, text);
  if (!intent) return res.json({ type: "text", text: "I couldn't find that. Try another query." });

  if (intent.a) return res.json({ type: "text", text: intent.a });
  if (intent.chart) {
    const data = datasetFor(intent.chart.dataset);
    return res.json({ type: "chart", chart: { type: intent.chart.type, data } });
  }
};

module.exports = { queryChatbot };

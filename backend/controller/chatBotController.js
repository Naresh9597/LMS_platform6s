const ChatbotPair = require("../models/ChatbotPair");
const StudentData = require("../models/StudentData");
const AdminMetrics = require("../models/AdminMetrics");

const queryChatbot = async (req, res) => {
  const { role, text } = req.body;const ChatbotPair = require("../models/ChatbotPair");
const StudentData = require("../models/StudentData");

const queryChatbot = async (req, res) => {
  const { role, text } = req.body;
  if (!role || !text) return res.status(400).json({ error: "Missing role or text" });

  try {
    const pairs = await ChatbotPair.find({ role });
    const intent = pairs.find(pair =>
      pair.q.some(q => text.toLowerCase().includes(q.toLowerCase()))
    );

    if (!intent) {
      return res.json({ type: "text", text: "I couldn't find that. Try another query." });
    }

    // Handle plain text responses
    if (intent.a) {
      return res.json({ type: "text", text: intent.a });
    }

    // Handle chart requests
    if (intent.chart) {
      let data = [];

      if (intent.chart.dataset === "studentProgress") {
        const student = await StudentData.findOne({ name: "Naresh B" }).lean();
        data = student?.progress || [];
      }

      if (intent.chart.dataset === "timeSpent") {
        const student = await StudentData.findOne({ name: "Naresh B" }).lean();
        data = student?.timeSpent || [];
      }

      if (intent.chart.dataset === "topicMastery") {
        const student = await StudentData.findOne({ name: "Naresh B" }).lean();
        data = student?.topicMastery || [];
      }

      return res.json({
        type: "chart",
        chart: {
          ...intent.chart,
          data
        }
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { queryChatbot };

  if (!role || !text) return res.status(400).json({ error: "Missing role or text" });

  try {
    const pairs = await ChatbotPair.find({ role });
    const intent = pairs.find(pair =>
      pair.q.some(q => text.toLowerCase().includes(q.toLowerCase()))
    );

    if (!intent) {
      return res.json({ type: "text", text: "I couldn't find that. Try another query." });
    }

    // Return text answer if available
    if (intent.a) return res.json({ type: "text", text: intent.a });

    // Return chart data if chart intent exists
    if (intent.chart) {
      let data = [];

      switch (intent.chart.dataset) {
        case "studentProgress":
          data = await StudentData.find({}, { _id: 0, week: 1, score: 1 }).lean();
          break;

        case "timeSpent":
          data = await StudentData.find({}, { _id: 0, week: 1, minutes: 1 }).lean();
          break;

        case "topicMastery":
          data = await StudentData.find({}, { _id: 0, topic: 1, mastery: 1 }).lean();
          break;

        case "usageThisWeek":
          data = await AdminMetrics.find({}, { _id: 0, course: 1, count: 1 }).lean();
          break;

        case "courseDistribution":
          data = await AdminMetrics.find({}, { _id: 0, course: 1, value: 1 }).lean();
          break;

        case "completionTrend":
          data = await AdminMetrics.find({}, { _id: 0, week: 1, completionRate: 1 }).lean();
          break;

        case "ratingBreakdown":
          data = await AdminMetrics.find({}, { _id: 0, course: 1, rating: 1 }).lean();
          break;

        case "topCourses":
          data = await AdminMetrics.find({}, { _id: 0, course: 1, value: 1 }).lean();
          break;

        case "leaderboard":
          data = await StudentData.find({}, { _id: 0, studentName: 1, score: 1 }).lean();
          break;

        default:
          data = [];
      }

      return res.json({
        type: "chart",
        chart: {
          ...intent.chart,
          title: intent.chart.dataset,
          data
        }
      });
    }

    res.json({ type: "text", text: "Sorry, I couldn't process this query." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { queryChatbot };

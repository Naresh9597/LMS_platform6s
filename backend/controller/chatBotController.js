const ChatbotPair = require("../models/ChatbotPair");
const StudentData = require("../models/StudentData");
const AdminMetrics = require("../models/AdminMetrics");

const queryChatbot = async (req, res) => {
  try {
    const { role, text } = req.body;
    if (!role || !text) {
      return res.status(400).json({ error: "Missing role or text" });
    }

    const pairs = await ChatbotPair.find({ role });
    const userQuery = text.toLowerCase();

    // Match query text with any keyword from q array (partial match)
    const intent = pairs.find(pair =>
      pair.q.some(q => userQuery.includes(q.toLowerCase()))
    );

    if (!intent) {
      return res.json({
        type: "text",
        text: "I couldn't find that. Try another query Or query 'Help'."
      });
    }

    // ✅ If plain text answer exists
    if (intent.a) {
      return res.json({
        type: "text",
        text: intent.a
      });
    }

    // ✅ Handle chart responses
    if (intent.chart && intent.chart.dataset) {
      let data = [];

      switch (intent.chart.dataset) {
        // --- Student datasets ---
        case "studentProgress": {
          const student = await StudentData.findOne({ name: "Naresh B" }).lean();
          data = student?.progress || [];
          break;
        }

        case "studentTimeSpent": {
          const student = await StudentData.findOne({ name: "Naresh B" }).lean();
          data = student?.timeSpent || [];
          break;
        }

        case "studentTopicMastery": {
          const student = await StudentData.findOne({ name: "Naresh B" }).lean();
          data = student?.topicMastery || [];
          break;
        }

        // --- Admin datasets ---
        case "adminWeeklyActive": {
          const metrics = await AdminMetrics.findOne().lean();
          data = metrics?.weeklyActive?.map((v, i) => ({
            day: "D" + (i + 1),
            users: v
          })) || [];
          break;
        }

        case "adminCompletionTrend": {
          const metrics = await AdminMetrics.findOne().lean();
          data = metrics?.completionTrend?.map((v, i) => ({
            week: "W" + (i + 1),
            completion: v
          })) || [];
          break;
        }

        case "adminCourseDistribution": {
          const metrics = await AdminMetrics.findOne().lean();
          data = metrics?.courseDistribution || [];
          break;
        }

        case "adminRatingBuckets": {
          const metrics = await AdminMetrics.findOne().lean();
          data = metrics?.ratingBuckets || [];
          break;
        }

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

    // Default fallback
    res.json({
      type: "text",
      text: "Sorry, I couldn't process this query."
    });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { queryChatbot };

const mongoose = require('mongoose');

const ChatbotPairSchema = new mongoose.Schema({
  role: { type: String, enum: ['admin', 'student'], required: true },
  q: { type: [String], required: true },          // list of queries
  a: { type: String },                            // optional text answer
  chart: {                                       // optional chart data reference
    type: { type: String },                      // e.g., "line", "bar", "pie", "radar"
    dataset: String                              // dataset key, e.g., "studentProgress"
  }
}, { timestamps: true });

module.exports = mongoose.model('ChatbotPair', ChatbotPairSchema);

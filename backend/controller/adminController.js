const AdminMetrics = require("../models/AdminMetrics");

const getAdminMetrics = async (req, res) => {
  try {
    const metrics = await AdminMetrics.findOne(); // get first (or latest) doc
    if (!metrics) {
      return res.status(404).json({ error: "Admin metrics not found" });
    }
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAdminMetrics };

const { adminMetrics } = require("../data/mockdata");

const getAdminMetrics = (req, res) => {
  res.json(adminMetrics);
};

module.exports = { getAdminMetrics };

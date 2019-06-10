const endpoints = require("../endpoints.json");

exports.getAllEndpoints = (req, res, next) => {
  res.status(200).json({ endpoints });
};

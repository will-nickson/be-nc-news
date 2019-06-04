const { fetchTopics } = require("../models/topics");

exports.sendAllTopics = (req, res, next) => {
  fetchTopics(req.query)
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

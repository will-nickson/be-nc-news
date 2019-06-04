const topicsRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { sendAllTopics } = require("../controllers/topics");

topicsRouter.route("/").get(sendAllTopics);

module.exports = topicsRouter;

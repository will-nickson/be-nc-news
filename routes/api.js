const apiRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const endpoints = require("../endpoints.json");
const topicsRouter = require("./topics");
const usersRouter = require("./users");
const articlesRouter = require("./articles");
const commentsRouter = require("./comments");

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter
  .route("/")
  .get((req, res, next) => {
    res.status(200).json(endpoints);
  })
  .all(methodNotAllowed);

module.exports = apiRouter;

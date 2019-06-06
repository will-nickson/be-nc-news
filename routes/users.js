const usersRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { getUserById } = require("../controllers/users");

usersRouter
  .route("/:username")
  .get(getUserById)
  .all(methodNotAllowed);

module.exports = usersRouter;

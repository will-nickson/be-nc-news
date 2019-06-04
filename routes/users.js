const usersRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { sendUser } = require("../controllers/users");

usersRouter
  .route("/:username")
  .get(sendUser)
  .all(methodNotAllowed);

module.exports = usersRouter;

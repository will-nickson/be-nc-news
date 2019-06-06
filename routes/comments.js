const commentsRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { patchCommentById } = require("../controllers/comments");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .all(methodNotAllowed);

module.exports = commentsRouter;

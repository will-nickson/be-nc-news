const commentsRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const {
  patchCommentById,
  removeCommentById
} = require("../controllers/comments");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(removeCommentById)
  .all(methodNotAllowed);

module.exports = commentsRouter;

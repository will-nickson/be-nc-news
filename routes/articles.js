const articlesRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const {
  getAllArticlesSorted,
  getArticleById,
  getCommentsByArticleId,
  patchArticleById,
  postCommentToArticleById
} = require("../controllers/articles");

articlesRouter
  .route("/")
  .get(getAllArticlesSorted)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentToArticleById)
  .all(methodNotAllowed);

module.exports = articlesRouter;

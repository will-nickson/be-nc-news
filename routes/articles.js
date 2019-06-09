const articlesRouter = require("express").Router();
const { methodNotAllowed } = require("../errors/index");
const {
  getArticles,
  getArticleByID,
  updateArticleByID,
  getCommentsByArticleID,
  addCommentToArticle
} = require("../controllers/articles");

articlesRouter
  .route("/")
  .get(getArticles)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(getArticleByID)
  .patch(updateArticleByID)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleID)
  .post(addCommentToArticle)
  .all(methodNotAllowed);

module.exports = articlesRouter;

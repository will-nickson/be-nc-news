const articlesRouter = require("express").Router();
const { methodNotAllowed } = require("../errors/index");
const {
  getAllArticles,
  postArticle,
  getArticleById,
  patchArticle,
  deleteArticle,
  getCommentsByArticleId,
  postCommentByArticleId
} = require("../controllers/articles");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .post(postArticle)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle)
  .delete(deleteArticle)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(methodNotAllowed);

module.exports = articlesRouter;

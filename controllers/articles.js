const {
  fetchAllArticles,
  addArticle,
  fetchArticleById,
  updateArticle,
  removeArticle,
  fetchCommentsByArticleId,
  addCommentByArticleId,
  countArticles
} = require("../models/articles");

const { checker, queryCreator } = require("../models/checker");

exports.getAllArticles = (req, res, next) => {
  const query = queryCreator(req, res, next);

  return Promise.all([
    fetchAllArticles(query),
    countArticles(query),
    checker(req)
  ])
    .then(([articles, count, topicExists]) => {
      if (topicExists === true) {
        const total_count = count.length;
        res.status(200).json({ total_count, articles });
      } else {
        next({ status: 404, msg: topicExists.msg });
      }
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const insert = req.body;
  insert.author = insert.username;
  delete insert.username;
  addArticle(insert)
    .then(([article]) => {
      res.status(201).json({ article });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  if (!Number.isNaN(+article_id)) {
    fetchArticleById({ article_id })
      .then(([article]) => {
        if (article === undefined)
          next({
            status: 404,
            msg: `The article_id (${article_id}) does not exist`
          });
        res.status(200).json({ article });
      })
      .catch(next);
  } else {
    next({ status: 400, msg: "article_id must be a number" });
  }
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const votes = req.body.inc_votes;
  if (!votes) {
    return fetchArticleById({ article_id })
      .then(([article]) => {
        if (article === undefined) {
          next({
            status: 404,
            msg: `(${article_id}) does not exist`
          });
        } else res.status(200).json({ article });
      })
      .catch(next);
  }
  if (typeof votes !== "number") {
    return next({
      status: 400
    });
  }
  if (
    Object.keys(req.body).includes("inc_votes") &&
    Object.keys(req.body).length < 2
  ) {
    return updateArticle({ article_id, votes })
      .then(([article]) => {
        res.status(200).json({ article });
      })
      .catch(next);
  }
  return next({ status: 400, msg: "Too many items in the body" });
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  if (!Number.isNaN(+article_id)) {
    removeArticle({ article_id })
      .then(response => {
        if (response < 1) {
          next({ status: 404, msg: "Id does not exist" });
        } else res.sendStatus(204);
      })
      .catch(next);
  } else {
    next({ status: 400, msg: "Article_id must be a number" });
  }
};

exports.getCommentsByArticleId = (req, res, next) => {
  const query = queryCreator(req, res, next);
  if (!Number.isNaN(+query.article_id)) {
    fetchCommentsByArticleId(query)
      .then(comments => {
        if (comments.length < 1) {
          next({
            status: 404,
            msg:
              "No messages associated with this article / no article with this Id"
          });
        } else res.status(200).json({ comments });
      })
      .catch(next);
  } else {
    next({ status: 400, msg: "Article_id must be a number" });
  }
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username: author, body } = req.body;
  if (!Number.isNaN(+article_id)) {
    addCommentByArticleId({ article_id, author, body })
      .then(([comment]) => {
        res.status(201).json({ comment });
      })
      .catch(err => {
        if (err.code === "23503") {
          return next({
            status: 422,
            msg: "Article_id or usename does not exist"
          });
        }
        return next(err);
      });
  } else {
    next({ status: 400, msg: "Article_id must be a number" });
  }
};

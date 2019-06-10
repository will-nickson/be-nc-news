const {
  selectArticles,
  updateArticle,
  selectComments,
  insertComment
} = require("../models/articles");

exports.getArticles = (req, res, next) => {
  // console.log(req.query);
  selectArticles(req.query)
    .then(([articles, [total_count]]) => {
      res.status(200).send({ ...total_count, articles });
    })
    .catch(next);
};

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticles({ ...req.query, article_id })
    .then(([[article]]) => {
      if (!article) next({ status: 404 });
      else res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleByID = (req, res, next) => {
  updateArticle(req.params.article_id, req.body)
    .then(([[article]]) => {
      if (!article) next({ status: 404 });
      else res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticleID = (req, res, next) => {
  selectComments(req.params.article_id, req.query)
    .then(comments => res.status(200).send({ comments }))
    .catch(next);
};

exports.addCommentToArticle = (req, res, next) => {
  const { body } = req.body;
  if (!body) next({ status: 400 });
  else {
    insertComment(req.params.article_id, req.body)
      .then(([comment]) => {
        res.status(201).send({ comment });
      })
      .catch(next);
  }
};

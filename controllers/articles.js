const {
  fetchArticles,
  fetchAllArticlesSorted,
  fetchComments,
  updateVoteCount,
  addComment
} = require("../models/articles");

exports.getArticles = (req, res, next) => {
  fetchArticles(req.query)
    .then((articles, total_count) => {
      res.status(200).send({ ...total_count, articles });
    })
    .catch(next);
};

exports.getAllArticlesSorted = (req, res, next) => {
  fetchAllArticlesSorted(req.query)
    .then((articles, total_count) => {
      res.status(200).send({ ...total_count, articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticles(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const increment = req.body.inc_votes;
  const { article_id } = req.params;
  updateVoteCount(article_id, increment)
    .then(([article]) => {
      if (!article)
        return Promise.reject({ status: 404, msg: "article not found" });
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  fetchComments(req.params.article_id, req.query)
    .then(comments => res.status(200).send([comments]))
    .catch(next);
};

exports.postCommentToArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  addComment({ article_id }, newComment)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

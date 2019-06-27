const connection = require("../db/connection");

exports.fetchAllArticles = ({ query, column, sort, limit, offset }) =>
  connection("articles")
    .select("articles.*")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count("comment_id AS comment_count")
    .groupBy("articles.article_id")
    .where(query)
    .orderBy(column, sort)
    .limit(limit)
    .offset(offset);

exports.countArticles = () =>
  connection("articles")
    .count("articles.article_id")
    .then(([{ count }]) => count);

exports.addArticle = insert =>
  connection("articles")
    .insert(insert)
    .returning("*");

exports.fetchArticleById = ({ article_id }) =>
  connection("articles")
    .select("articles.*")
    .count("comment_id AS comment_count")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where({ "articles.article_id": article_id });

exports.updateArticle = ({ article_id, votes }) =>
  connection("articles")
    .where({ article_id })
    .increment("votes", votes)
    .returning("*");

exports.removeArticle = ({ article_id }) =>
  connection("articles")
    .where({ "articles.article_id": article_id })
    .del();

exports.fetchCommentsByArticleId = ({
  article_id,
  column,
  sort,
  limit,
  offset
}) =>
  connection("comments")
    .select("*")
    .where({ article_id })
    .orderBy(column, sort)
    .limit(limit)
    .offset(offset);

exports.addCommentByArticleId = insert =>
  connection("comments")
    .insert(insert)
    .returning("*");

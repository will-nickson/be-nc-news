const connection = require("../db/connection");

exports.fetchArticles = article_id => {
  //   if (!article) return Promise.reject({ status: 404 });
  return connection("articles")
    .select("articles.*")
    .count("comments.article_id AS comment_count")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .groupBy("articles.article_id")
    .modify(query => {
      if (article_id)
        query.where({ "articles.article_id": article_id }).first();
    });
};

exports.fetchAllArticlesSorted = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic
}) => {
  return connection("articles")
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .count("comments.article_id AS comment_count")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .groupBy("articles.article_id")
    .modify(query => {
      if (author) query.where({ "articles.author": author });
      if (topic) query.where({ topic });
    });
};

exports.fetchComments = (
  article_id,
  { sort_by = "comments.created_at", order = "desc" }
) => {
  return connection("comments")
    .select("*")
    .modify(query => {
      if (article_id)
        query.where({ "comments.article_id": article_id }).first();
    })
    .orderBy(sort_by, order);
};

exports.updateVoteCount = (article_id, increment, next) => {
  return connection("articles")
    .where({ article_id })
    .increment("votes", increment)
    .returning("*");
};

exports.addComment = ({ article_id }, { username, body }, next) => {
  return connection("comments")
    .insert({ author: username, body, article_id: article_id })
    .into("comments")
    .returning("*");
};

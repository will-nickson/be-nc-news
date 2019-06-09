const connection = require("../db/connection");

const selectArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic,
  article_id
}) => {
  // if (!sort_by.includes(author)) return Promise.reject({ status: 404 });

  return Promise.all([
    connection("articles")
      .select(
        "articles.author",
        "title",
        "articles.article_id",
        "articles.body",
        "topic",
        "articles.created_at",
        "articles.votes"
      )
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .count("comments.article_id AS comment_count")
      .groupBy("articles.article_id")
      .orderBy(sort_by, order)
      .modify(query => {
        if (author) query.where({ "articles.author": author });
        if (topic) query.where({ topic });
        if (article_id) query.where({ "articles.article_id": article_id });
      }),
    connection("articles")
      .modify(query => {
        if (author) query.where({ "articles.author": author });
        if (topic) query.where({ topic });
        if (article_id) query.where({ "articles.article_id": article_id });
      })
      .count("article_id AS total_count"),
    connection("topics")
      .select("slug")
      .modify(query => {
        if (topic) query.where({ slug: topic });
      })
      .then(topics => {
        if (topics.length === 0) return Promise.reject({ status: 404 });
      })
  ]);
};

const insertArticle = ({ username: author, ...articleRest }) => {
  return connection
    .insert({ author, ...articleRest })
    .into("articles")
    .returning([
      "author",
      "title",
      "article_id",
      "body",
      "topic",
      "created_at",
      "votes"
    ]);
};

const updateArticle = (article_id, { inc_votes = 0 }) => {
  return connection("articles")
    .where({ article_id })
    .increment("votes", inc_votes)
    .then(() => {
      return selectArticles({ article_id });
    });
};

const selectComments = (
  article_id,
  { sort_by = "created_at", order = "desc" }
) => {
  return selectArticles({ article_id }).then(([[article]]) => {
    if (!article) return Promise.reject({ status: 404 });
    return connection("comments")
      .select("comment_id", "votes", "created_at", "author", "body")
      .where({ article_id })
      .orderBy(sort_by, order);
  });
};

const insertComment = (
  article_id,
  { username: author, ...commentRemainder }
) => {
  return connection
    .insert({ article_id, author, ...commentRemainder })
    .into("comments")
    .returning([
      "article_id",
      "comment_id",
      "votes",
      "created_at",
      "author",
      "body"
    ]);
};
module.exports = {
  selectArticles,
  insertArticle,
  updateArticle,
  selectComments,
  insertComment
};

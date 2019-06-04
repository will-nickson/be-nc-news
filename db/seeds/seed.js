const {
  topicsData,
  usersData,
  articlesData,
  commentsData
} = require("../data/index.js");

const {
  formatDate,
  renameKeys,
  replaceKeysOfObject,
  createReferenceObject
} = require("../../utils/index");

exports.seed = (knex, Promise) => {
  // console.log("seeding stuff");
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex.insert(topicsData).into("topics"))
    .then(() => knex.insert(usersData).into("users"))
    .then(() => {
      const articleDataTimestamp = formatDate(articlesData);
      return knex
        .insert(articleDataTimestamp)
        .into("articles")
        .returning("*");
    })
    .then(articles => {
      const articleTitleIdPairs = createReferenceObject(
        articles,
        "title",
        "article_id"
      );
      const commentsDataArticleId = replaceKeysOfObject(
        commentsData,
        "belongs_to",
        "article_id",
        articleTitleIdPairs
      );
      const commentsDataTimestamp = formatDate(commentsDataArticleId);
      const renamedBelongToComments = renameKeys(
        commentsDataTimestamp,
        "created_by",
        "author"
      );
      return knex
        .insert(renamedBelongToComments)
        .into("comments")
        .returning("*");
    });
  // .then(console.log)
};

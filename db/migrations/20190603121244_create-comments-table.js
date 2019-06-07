exports.up = function(knex, Promise) {
  // console.log("creating comments table...");
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primary();
    commentsTable
      .string("author")
      .references("users.username")
      .notNullable();
    commentsTable
      .integer("article_id")
      .references("articles.article_id")
      .notNullable();
    commentsTable.integer("votes").defaultTo(0);
    commentsTable.timestamp("created_at").defaultTo(knex.fn.now());
    commentsTable.text("body");
  });
};

exports.down = function(knex, Promise) {
  // console.log("removing comments tables...");
  return knex.schema.dropTable("comments");
};

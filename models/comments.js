const connection = require("../db/connection");

exports.updateComment = (comment_id, { inc_votes = 0 }, next) => {
  return connection("comments")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*");
};

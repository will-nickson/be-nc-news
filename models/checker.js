const connection = require("../db/connection");

exports.checker = (req, res, next) => {
  if (req.query.topic) {
    return connection("topics")
      .select("*")
      .where({ slug: req.query.topic })
      .then(response => {
        if (response.length === 0) {
          return { msg: `${req.query.topic} does not exist` };
        }
        return true;
      });
  }
  if (req.query.author) {
    return connection("users")
      .select("*")
      .where({ username: req.query.author })
      .then(response => {
        if (response.length === 0) {
          return {
            msg: `The author ${req.query.author} does not exist`
          };
        }
        return true;
      });
  }
  return true;
};

exports.queryCreator = (req, res, next) => {
  const { article_id } = req.params;
  const query = {};
  const column = req.query.sort_by || "created_at";
  let sort = "desc";
  const limit = req.query.limit || 10;
  const p = req.query.p || 1;
  const offset = limit * (p - 1);
  if (req.query.author) query["articles.author"] = req.query.author;
  if (req.query.topic) query.topic = req.query.topic;
  if (req.query.order) {
    if (req.query.order === "asc" || req.query.order === "desc") {
      sort = req.query.order;
    } else {
      next({
        status: 400
      });
    }
  }
  return {
    query,
    column,
    sort,
    limit,
    offset,
    article_id
  };
};

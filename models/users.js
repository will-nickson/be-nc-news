const connection = require("../db/connection");

exports.fetchUser = ({ username }) => {
  return connection
    .select("*")
    .from("users")
    .where({ username });
};

const connection = require("../db/connection");

exports.fetchTopics = () => {
  return connection.select("description", "slug").from("topics");
};

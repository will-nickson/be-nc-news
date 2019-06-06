const connection = require("../db/connection");

const fetchUsers = username => {
  return connection
    .select("*")
    .from("users")
    .where({ username });
};

module.exports = { fetchUsers };

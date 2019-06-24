const connection = require("../db/connection");

exports.addNewUser = insert =>
  connection("users")
    .insert(insert)
    .returning("*");

exports.fetchUsers = () => connection("users").select("*");

exports.fetchUserById = username =>
  connection("users")
    .select("*")
    .where(username);

const { fetchUsers } = require("../models/users");

exports.getUsers = (req, res, next) => {
  fetchUsers().then(users => res.status(200).json({ users }));
};

exports.postNewUser = (req, res, next) => {
  const { username, avatar_url, name } = req.body;
  addNewUser({ username, avatar_url, name })
    .then(([user]) => res.status(201).json({ user }))
    .catch(next);
};

exports.getUserById = (req, res, next) => {
  const { username } = req.params;
  fetchUserById({ username }).then(([user]) => {
    if (user) res.status(200).json({ user });
    else {
      next({
        status: 404,
        msg: "User does not exist"
      });
    }
  });
};

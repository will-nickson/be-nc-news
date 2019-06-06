const { fetchUsers } = require("../models/users");

exports.getUserById = (req, res, next) => {
  fetchUsers(req.params.username)
    .then(([user]) => {
      if (!user) next({ status: 404 });
      else res.status(200).send({ user });
    })
    .catch(next);
};

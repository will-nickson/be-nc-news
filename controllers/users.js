const { fetchUser } = require("../models/users");

exports.sendUser = (req, res, next) => {
  fetchUser(req.params)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

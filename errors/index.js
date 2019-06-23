exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

exports.handle422 = (err, req, res, next) => {
  if (err.code === "23505") {
    res.status(422).json({ msg: err.detail });
  }
};

exports.handle404 = (err, req, res, next) => {
  const psqlCodes = ["23503"];
  if (err.status === 404 || psqlCodes.includes(err.code))
    res.status(404).send({ msg: "Resource Not Found" });
  else next(err);
};

exports.handle400 = (err, req, res, next) => {
  const psqlCodes = ["22P02", "23502", "42703"];
  if (err.status === 400 || psqlCodes.includes(err.code))
    res.status(400).send({ msg: "Bad Request" });
  else next(err);
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};

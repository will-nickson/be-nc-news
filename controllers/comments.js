const { updateComment, deleteComment } = require("../models/comments");

exports.patchCommentById = (req, res, next) => {
  updateComment(req.params.comment_id, req.body)
    .then(([comment]) => {
      if (comment) res.status(200).send({ comment });
      else return Promise.reject({ status: 404, msg: "comment not found" });
    })
    .catch(next);
};

exports.removeCommentById = (req, res, next) => {
  deleteComment(req.params.comment_id)
    .then(successful => {
      if (successful) res.sendStatus(204);
      else return Promise.reject({ status: 404, msg: "comment_id not found" });
    })
    .catch(next);
};

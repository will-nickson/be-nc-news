const { updateComment } = require("../models/comments");

exports.patchCommentById = (req, res, next) => {
  updateComment(req.params.comment_id, req.body)
    .then(([comment]) => {
      if (!comment)
        return Promise.reject({ status: 404, msg: "comment not found" });
      res.status(200).send({ comment });
    })
    .catch(next);
};

const chatModel = require("../models/chatModel")

exports.list = function (req, res) {
  let {
    page,
    per_page,
    room
  } = req.query

  page = page ? page : 1
  per_page = per_page ? per_page : 10
  let filter = {}
  if (room) {
    filter.room = room
  }
  chatModel
  .find(filter)
  .skip((page * per_page) - per_page)
  .limit(parseInt(per_page))
  .sort({created_at: -1})
  .exec( (err, data) => {
    if (err) {
      return res.send(500, err);
    }
    chatModel.countDocuments(filter, (errCount, count) => {
      if (errCount) {
        return res.send(500, errCount);
      }
      return res.status(200).send({
        message: 'success',
        data: data,
        page,
        per_page,
        total_page : Math.ceil(count / per_page),
        count
      });
    })

  });
};
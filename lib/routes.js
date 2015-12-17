var process = require('./process');

exports.order = function order(req, res, next) {
  console.log(req.body);
  process.order(req.body, function(unk, result) {
    res.json(result);
  });
};

exports.feedback = function feedback(req, res, next) {
  console.info("FEEDBACK:", req.body.type, req.body.content);
  next();
};

exports.categories = function categories(req, res, next) {
  process.categories(req.body, function(unk, result) {
    res.json(result);
  });
};

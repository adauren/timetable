module.exports = function(req, res, next) {
  if (!req.session.user) {
    res.render("404");
  } else {
    next();
  }
};

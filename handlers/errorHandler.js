function errorHandler(err, req, res, next) {
  if (err.message && err.code) {
    res.status(err.code).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = errorHandler;

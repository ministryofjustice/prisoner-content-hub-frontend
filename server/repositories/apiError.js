class NotFound extends Error {
  getCode() {
    return 404;
  }
}

module.exports = {
  NotFound,
};

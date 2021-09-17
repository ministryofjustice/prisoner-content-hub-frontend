/* eslint-disable class-methods-use-this */

class NotFound extends Error {
  getCode() {
    return 404;
  }
}

module.exports = {
  NotFound,
};

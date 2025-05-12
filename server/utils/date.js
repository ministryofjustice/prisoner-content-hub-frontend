const {
  parseISO,
  isValid,
  formatDistance,
  getUnixTime,
  subDays,
} = require('date-fns');

const formatTimeBetweenOrDefault = (placeHolder, start, finish) => {
  if (!isValid(new Date(start))) {
    return placeHolder;
  }
  return finish
    ? formatDistance(parseISO(start), parseISO(finish))
    : formatDistance(parseISO(start), new Date());
};

const getOffsetUnixTime = (offset, timeStamp) =>
  getUnixTime(subDays(timeStamp || new Date(), offset || 0));

module.exports = {
  formatTimeBetweenOrDefault,
  getOffsetUnixTime,
};

const {
  parseISO,
  format,
  isValid,
  formatDistance,
  getUnixTime,
  subDays,
} = require('date-fns');

const formatDateOrDefault = (placeHolder, dateFormat, date) => {
  if (!isValid(new Date(date))) {
    return placeHolder;
  }
  return format(parseISO(date), dateFormat);
};

const formatTimeBetweenOrDefault = (placeHolder, start, finish) => {
  if (!isValid(new Date(start))) {
    return placeHolder;
  }
  return finish
    ? formatDistance(parseISO(start), parseISO(finish))
    : formatDistance(parseISO(start), new Date());
};

const sortByDateTime = (firstDate, secondDate) => {
  if (firstDate && secondDate)
    return parseISO(firstDate).valueOf() - parseISO(secondDate).valueOf();
  if (firstDate) return -1;
  if (secondDate) return 1;
  return 0;
};

const getOffsetUnixTime = (offset, timeStamp) =>
  getUnixTime(subDays(timeStamp || new Date(), offset || 0));

module.exports = {
  formatDateOrDefault,
  formatTimeBetweenOrDefault,
  sortByDateTime,
  getOffsetUnixTime,
};

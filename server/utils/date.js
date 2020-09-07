const { parseISO, format, isValid, formatDistance } = require('date-fns');

const formatDateOrDefault = (placeHolder = '', dateFormat, date) => {
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

module.exports = {
  formatDateOrDefault,
  formatTimeBetweenOrDefault,
};

const {
  parseISO,
  format,
  isValid,
  formatDistance,
  startOfMonth,
  subMonths,
  formatISO,
} = require('date-fns');

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

const getDateSelection = (date = new Date(), selectedDate, amount = 12) => {
  const startDate = startOfMonth(date);
  const dateRange = [];

  for (let offset = 0; offset < amount; offset += 1) {
    const current = subMonths(startDate, offset);
    const element = {
      text: format(current, 'MMMM yyyy'),
      value: formatISO(current, { representation: 'date' }),
    };

    if (
      selectedDate &&
      startOfMonth(selectedDate).valueOf() === current.valueOf()
    ) {
      element.selected = true;
    }

    dateRange.push(element);
  }

  return dateRange;
};

const sortByDateTime = (firstDate, secondDate) => {
  if (firstDate && secondDate)
    return parseISO(firstDate).valueOf() - parseISO(secondDate).valueOf();
  if (firstDate) return -1;
  if (secondDate) return 1;
  return 0;
};

module.exports = {
  formatDateOrDefault,
  formatTimeBetweenOrDefault,
  getDateSelection,
  sortByDateTime,
};

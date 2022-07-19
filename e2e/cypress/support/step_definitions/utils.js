import { format, addDays } from 'date-fns';

const horizontalTableToObject = ({ rawTable }) => {
  const [keys, ...rows] = rawTable;
  return rows.map(values =>
    keys.reduce((obj, key, i) => {
      const value = values[i];
      obj[key] = isNaN(value) ? value : Number(value);
      return obj;
    }, {}),
  );
};

const verticalTableToObject = ({ rawTable }) => {
  return rawTable.reduce((arr, [key, ...rawValues]) => {
    rawValues.forEach((rawValue, i) => {
      if (!arr[i]) arr[i] = {};
      const obj = arr[i];
      const value = isNaN(rawValue) ? rawValue : Number(rawValue);
      if (obj[key])
        if (Array.isArray(obj[key])) obj[key].push(value);
        else obj[key] = [obj[key], value];
      else obj[key] = value;
      return obj;
    });
    return arr;
  }, []);
};

const daysFromNow = n => format(addDays(new Date(), n), 'yyyy-MM-dd');

export { horizontalTableToObject, verticalTableToObject, daysFromNow };

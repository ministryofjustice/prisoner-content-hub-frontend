const isValidPrisonerId = s =>
  typeof s === 'string' && s.match(/^[A-Z][0-9]{4}[A-Z]{2}$/i);
const isValidBookingId = n => typeof n === 'number';
const isValidPrisonId = s => typeof s === 'string' && s.match(/^[A-Z]{3}$/i);
const isValidAccountCode = s =>
  typeof s === 'string' && ['spends', 'cash', 'savings'].includes(s);
const isValidDate = d => d instanceof Date;

module.exports = {
  isValidPrisonerId,
  isValidBookingId,
  isValidPrisonId,
  isValidAccountCode,
  isValidDate,
};

const alphabetical = /^[a-z]+$/i;

const toAlpha = ( value, max=10 ) => value.toLowerCase().match(alphabetical)[0].slice(0, max)

module.exports = {
  toAlpha
}
const renameKey = (data, currentKeyName, newKeyName) => {
  if (!data || !currentKeyName || !newKeyName) {
    throw new Error('data, currentKeyName and newKeyName are all required');
  }

  const newDataObject = { ...data, [newKeyName]: data[currentKeyName] };
  delete newDataObject[currentKeyName];

  return newDataObject;
};

module.exports = {
  renameKey,
};

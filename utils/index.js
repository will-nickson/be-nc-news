const formatDate = (array, key = "created_at") =>
  array.map(element => {
    const timestamp = new Date(element[key]).toISOString();
    return { ...element, [key]: timestamp };
  });

const renameKeys = (array, keyToChange, newKey) => {
  const newArray = [];
  if (keyToChange !== newKey) {
    array.map(arrayIndex => {
      const newObj = { ...arrayIndex, [newKey]: arrayIndex[keyToChange] };
      delete newObj[keyToChange];
      newArray.push(newObj);
    });
  }
  return newArray;
};

const replaceKeysOfObject = (array, oldKey, newKey, keyPairings) =>
  array.map(element => {
    const newElement = { ...element, [newKey]: keyPairings[element[oldKey]] };
    delete newElement[oldKey];
    return newElement;
  });

const createReferenceObject = (array, keyToChange, keyAsValue) => {
  return array.reduce((accumulator, element) => {
    accumulator[element[keyToChange]] = element[keyAsValue];
    return accumulator;
  }, {});
};

module.exports = {
  formatDate,
  renameKeys,
  replaceKeysOfObject,
  createReferenceObject
};

function removeDuplicates(obj_arr) {
  const newArray = [];
  const lookupObject = {};

  for (let i in obj_arr) {
    lookupObject[obj_arr[i].Restaurant.id] = obj_arr[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }

  return newArray;
}

module.exports = removeDuplicates
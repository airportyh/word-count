"use strict"
const fs = require('fs');

main();

function main() {
  const content = fs.readFileSync('words.txt').toString();
  const words = content.split(/[\s.,\/:\n]+/);
  const tally = words.map(toLowerCase)
    .reduce(function(tally, word) {
      return Object.assign({}, tally, {
        [word]: (tally[word] || 0) + 1
      });
    }, {});

  const tallyAsArray = sortedArray(
    Object.keys(tally)
      .map(function(word) {
        return [word, tally[word]];
      }), function(one, other) {
        return other[1] - one[1];
      });

  const top10 = tallyAsArray.slice(0, 10);

  // ---------- The Only Imperative Code (has mutable code) --------
  console.log('The top 10 most frequently used:');
  console.log('--------------------------------');
  top10.forEach(displayRank);

  function displayRank(entry, rank) {
    let word = entry[0];
    let count = entry[1];
    console.log(rank + '. ' + word + ': ' + count);
  }
}

function toLowerCase(str) {
  return str.toLowerCase();
}

function sortedArray(arr, compare) {
  let result = arr.slice(0).sort(compare);
  return result;
}

function copy(obj) {
  let newObj = {};
  for (let key in obj) {
    newObj[key] = obj[key];
  }
  return newObj;
}
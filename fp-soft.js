"use strict"
const fs = require('fs');

main();

function main() {
  const content = fs.readFileSync('words.txt').toString();
  const words = content.split(/[\s.,\/:\n]+/);
  const tally = words.map(function(str) {
      return str.toLowerCase();
    })
    .reduce(function(tally, word) {
      tally[word] = (tally[word] || 0) + 1;
      return tally;
    }, {});

  const tallyAsArray = Object.keys(tally)
    .map(function(word) {
      return [word, tally[word]];
    }).sort(function(one, other) {
      return other[1] - one[1];
    });

  const top10 = tallyAsArray.slice(0, 10);

  console.log('The top 10 most frequently used:');
  console.log('--------------------------------');
  top10.forEach(displayRank);
}

function displayRank(entry, rank) {
  let word = entry[0];
  let count = entry[1];
  console.log(rank + '. ' + word + ': ' + count);
}
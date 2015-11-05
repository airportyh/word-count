"use strict"
const fs = require('fs');
const Immutable = require('immutable');

main();

function main() {
  const content = fs.readFileSync('words.txt').toString();
  const words = content.split(/[\s.,\/:\n]+/);
  const tally = words.map(toLowerCase)
    .reduce(function(tally, word) {
      return tally.set(word, tally.get(word, 0) + 1);
    }, Immutable.Map());

  const sorted = tally
    .sort(function(one, other) {
      return other - one;
    });

  const top10 = sorted.take(10);
  const output = displayTop10(top10);

  console.log(output);
}

function displayTop10(top10) {
  const rankWithTop10 = Immutable.fromJS(Array(10))
    .zip(top10).map(displayRank);
  return Immutable.List.of(
    'The top 10 most frequently used:',
    '--------------------------------'
  ).concat(rankWithTop10).join('\n');
}

function displayRank(entry, idx) {
  let rank = idx + 1;
  let pair = entry[1];
  let word = pair[0];
  let count = pair[1];
  return rank + '. ' + word + ': ' + count;
}

function toLowerCase(str) {
  return str.toLowerCase();
}
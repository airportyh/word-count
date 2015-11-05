"use strict"
const fs = require('fs');
const Immutable = require('immutable');

main();

function main() {
  console.log(wordCount(fs.readFileSync('words.txt').toString()));
}

function wordCount(input) {
  return renderTop10(
    tally(splitWords(input)
      .map(toLowerCase))
    .sort(function(one, other) {
      return other - one;
    }).take(10));
}

function tally(words) {
  return words
    .reduce(function(tally, word) {
      return tally.set(word, tally.get(word, 0) + 1);
    }, Immutable.Map());
}

function splitWords(str) {
  return str.split(/[\s.,\/:\n]+/);
}

function renderTop10(top10) {
  const rankWithTop10 = 
    Immutable.fromJS(Array(10))
      .zip(top10).map(renderRank);
  return Immutable.List.of(
    'The top 10 most frequently used:',
    '--------------------------------'
  ).concat(rankWithTop10).join('\n');
}

function renderRank(entry, idx) {
  let rank = idx + 1;
  let pair = entry[1];
  let word = pair[0];
  let count = pair[1];
  return rank + '. ' + word + ': ' + count;
}

function toLowerCase(str) {
  return str.toLowerCase();
}
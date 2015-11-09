/*
This program is a refactoring of program 5 by extracting a set of "pure" functions.
A pure function (https://en.wikipedia.org/wiki/Pure_function) is a function which
introduces no side-effects (any effects other than its return value), and which always
returns the same result given the same input. Three such functions were extracted:
splitWords, getTally, and getTallyAsArray.

This code mirrors the structure of program 2.
*/
"use strict"
const fs = require('fs');

const content = fs.readFileSync('words.txt').toString();
const words = splitWords(content);
const tally = tallyUp(words);
const top10 = getTop10(tally);
printTop10(top10);

/* ---- pure functions --------------- */

function splitWords(text) {
  return content.split(/[\s.,\/:\n]+/);
}

function tallyUp(words) {
  return words
    .map(function(str) {
      return str.toLowerCase();
    })
    .reduce(function(tally, word) {
      tally[word] = (tally[word] || 0) + 1;
      return tally;
    }, {});
}

function getTop10(tally) {
  return Object.keys(tally)
    .map(function(word) {
      return { word: word, count: tally[word] };
    }).sort(function(one, other) {
      return other.count - one.count;
    }).slice(0, 10);
}

/* ---- non-pure functions ------------ */

// printTop10 is the only non-pure function because
// it outputs text to the console - which is a side effect.
function printTop10(top10) {
  console.log('The top 10 most frequently used:');
  console.log('--------------------------------');

  top10.forEach(function(entry, i) {
    let rank = i + 1;
    console.log(rank + '. ' + entry.word + ': ' + entry.count);
  });
}
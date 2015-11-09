/*
This version of the program demonstrates what I call "softcore"
functional programming, and is how most people get their first exposures
to FP. It is also how most people in hybrid languages like JavaScript,
Ruby, and Python use FP. This is a refactoring/rewrite of program 1.
It makes use of functional programming utilities offered by the "map", 
"forEach", and "reduce" methods of the JavaScript array (available since
ECMAScript 5), which makes using for loops unnecessary.

The use of const instead of let both enforces and shows that the variables
that are used in this program are not reassigned to a different value.
*/
"use strict"
const fs = require('fs');

const content = fs.readFileSync('words.txt').toString();
const words = content.split(/[\s.,\/:\n]+/);
const tally = words
  .map(function(str) {
    // rather than convert each word to lowercase
    // in the body of a loop, we use map to convert
    // the entire array into an array of words containing
    // only lowercased words
    return str.toLowerCase();
  })
  .reduce(function(tally, word) {
    // rather than using a for loop, we use .reduce to "loop"
    // through the array of words, and modify the tally object
    // as we go, in the same manner as program 1
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
    tally[word] = (tally[word] || 0) + 1;
    return tally;
  }, {} /* <- the initial state of the tally object */);

const tallyAsArray = Object.keys(tally) // <- gives the keys of tally as an array
  .map(function(word) {
    // use map to return an array of objects containing
    // "word" and "count" for each word in the tally
    return { word: word, count: tally[word] };
  }).sort(function(one, other) {
    // sort the resulting array in descending order of count
    return other.count - one.count;
  });

const top10 = tallyAsArray.slice(0, 10);

console.log('The top 10 most frequently used:');
console.log('--------------------------------');

// instead of using a for loop, use the forEach method to loop over
// each entry, and print them out
top10.forEach(function(entry, i) {
  const rank = i + 1;
  console.log(rank + '. ' + entry.word + ': ' + entry.count);
});

/*

This program implements the program in a straight-forward, straigt-line
fashion, using the imperative style, which just means we write a series
of commands, and each of these commands can modify the state of the
program in some way. It is the style we inherited from C and even older
programming languages.

*/
"use strict"
const fs = require('fs');

// reads the contents of the file as one big string
let content = fs.readFileSync('words.txt').toString();

// splits the string into an array of words using a regular expression
let words = content.split(/[\s.,\/:\n]+/);

// tallies up the words
let tally = {};                           // use an object
                                          // keyed by word
                                          // to tally the counts
                                          // for each word
for (let i = 0; i < words.length; i++) {
  let word = words[i].toLowerCase();      // lowercase so 
                                          // that we merge 
                                          // different casing

  tally[word] = (tally[word] || 0) + 1;   // add one to the
                                          // tally for this word
                                          // we want to add 1 to
                                          // 0 in case the tally
                                          // for that word has
                                          // not been initialized
                                          // and is undefined
}

// to find the top 10, we have to convert the tally object
// to an array, sort it, and then take only the top 10
let tallyAsArray = [];
for (let word in tally) {
  tallyAsArray.push({ word: word, count: tally[word] });
}
tallyAsArray.sort(function(one, other) {
  return other.count - one.count;
});
let top10 = tallyAsArray.slice(0, 10);

// print the top 10
console.log('The top 10 most frequently used:');
console.log('--------------------------------');
for (let i = 0; i < top10.length; i++) {
  let rank = i + 1;
  let entry = top10[i];
  console.log(rank + '. ' + entry.word + ': ' + entry.count); 
}
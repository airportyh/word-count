/*
This is just a refactored version of program 1. It simply extracts
sections of the program into functions. The advantage is that the
main body of this program is now only 5 lines, and can be understood
at a high-level - sort of like an outline - without having to understand
everything about how the program works.
*/
"use strict"
const fs = require('fs');

// the below 5 lines is the main body of the program
let content = fs.readFileSync('words.txt').toString();
let words = splitIntoWords(content)
let tally = tallyUp(words);
let top10 = getTop10(tally);
printTop10(top10);

// ---- The rest of the program defines the supporting functions ---

// splitIntoWords - splits a string into an array of words
function splitIntoWords(text) {
  return text.split(/[\s.,\/:\n]+/);
}

// tallyUp - given an array of words, returns a tally object
//   where each key of the object is a word, and the corresponding
//   value is the number of times that word appeared in the array
function tallyUp(words) {
  let tally = {};
  for (let i = 0; i < words.length; i++) {
    let word = words[i].toLowerCase();
    tally[word] = (tally[word] || 0) + 1;
  }
  return tally;
}

// getTop10 - given the tally object (in the format returned by tallyUp)
//   return the top 10 words in the tally as an array of objects containing
//   the properties "word" and "count", where "word" contains the word and
//   "count" contains the number of times the word appeared.
function getTop10(tally) {
  let tallyAsArray = [];
  for (let word in tally) {
    tallyAsArray.push({ word: word, count: tally[word] });
  }
  tallyAsArray.sort(function(one, other) {
    return other.count - one.count;
  });
  return tallyAsArray.slice(0, 10);
}

// printTop10 - given an array of 10 objects containing the properties
//    "word", and "count". Print out a header and then print each result
//    one on a line.
function printTop10(top10) {
  // print the top 10
  console.log('The top 10 most frequently used:');
  console.log('--------------------------------');
  for (let i = 0; i < top10.length; i++) {
    let rank = i + 1;
    let entry = top10[i];
    console.log(rank + '. ' + entry.word + ': ' + entry.count); 
  }
}
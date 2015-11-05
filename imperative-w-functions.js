"use strict"
const fs = require('fs');

// reads the contents of the file as one big string
let content = fs.readFileSync('words.txt').toString();

let words = splitIntoWords(content)
let tally = tallyUp(words);
let top10 = getTop10(tally);
printTop10(top10);

function splitIntoWords(text) {
  // splits the string into an array of words using a regular expression
  return text.split(/[\s.,\/:\n]+/);
}

function tallyUp(words) {
  let tally = {};

  // tallies up the words
  for (let i = 0; i < words.length; i++) {
    let word = words[i].toLowerCase(); // lowercase so 
                                       // that we merge 
                                       // different casing
    tally[word] = (tally[word] || 0) + 1;
  }
  return tally;
}

function getTop10(tally) {
  // to find the top 10, we have to convert it to an array
  // sort it, and then take only the top 10
  let tallyAsArray = [];
  for (let word in tally) {
    tallyAsArray.push([word, tally[word]]);
  }
  tallyAsArray.sort(function(one, other) {
    return other[1] - one[1];
  });
  return tallyAsArray.slice(0, 10);
}

function printTop10(top10) {
  // print the top 10
  console.log('The top 10 most frequently used:');
  console.log('--------------------------------');
  for (let i = 0; i < top10.length; i++) {
    let rank = i + 1;
    let pair = top10[i];
    let word = pair[0];
    let count = pair[1];
    console.log(rank + '. ' + word + ': ' + count); 
  }
}
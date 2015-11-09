/*
This program is a refactoring of program 2 into a class - in object-oriented
programming terms. It converts the functions in program 2 into methods, and uses
a static method "main()" to kick-off the program.
*/
"use strict"
const fs = require('fs');

class WordCount {
  // the constructor takes in the location of the file, os that
  // later we can easily use this on other files
  constructor(filepath) {
    this.filepath = filepath;
  }

  // returns the content of the file as a string
  content() {
    return fs.readFileSync(this.filepath).toString();
  }

  // returns the contents as an array of words
  words() {
    return this.content().split(/[\s.,\/:\n]+/);
  }

  // returns a tally object, as tallyUp in program 2 does
  tally() {
    let words = this.words();
    let tally = {};

    for (let i = 0; i < words.length; i++) {
      let word = words[i].toLowerCase();
      tally[word] = (tally[word] || 0) + 1;
    }
    return tally;
  }

  // returns the top 10 words as an array, as getTop10 does
  // in program 2
  top10() {
    let tally = this.tally();
    let tallyAsArray = [];
    for (let word in tally) {
      tallyAsArray.push({ word: word, count: tally[word] });
    }
    tallyAsArray.sort(function(one, other) {
      return other.count - one.count;
    });
    return tallyAsArray.slice(0, 10);
  }

  // prints the top 10 words as printTop10 does in
  // program 2
  printTop10() {
    let top10 = this.top10();
    console.log('The top 10 most frequently used:');
    console.log('--------------------------------');
    for (let i = 0; i < top10.length; i++) {
      let rank = i + 1;
      let entry = top10[i];
      console.log(rank + '. ' + entry.word + ': ' + entry.count); 
    }
  }

  // the main entry point of the program, to be called below
  static main() {
    let tally = new WordCount('words.txt');
    tally.printTop10();
  }

}

WordCount.main();
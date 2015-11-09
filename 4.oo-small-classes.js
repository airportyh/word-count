/*
This OO version of the program splits the responsibily of the program
between a set of small objects. In larger programs, this has many benefits
including the reusability of the individual objects, and the ease of
understanding how each individual object works in isolation. In a small
program like this, the main benefit is to have an easy to understand outline
of the program - as you see in the main method - in the same way as you do in
program 2.
*/
"use strict"
const fs = require('fs');

// Tokenizer - responsible for spliting long text into an array of words
class Tokenizer {
  tokenize(text) {
    return text.split(/[\s.,\/:\n]+/);
  }
}

// FileReader - responsible for reading a file, into either a string or
//   an array of words
class FileReader {
  constructor(filepath) {
    this.filepath = filepath;
  }

  // return a string containing the contents of the file
  read() {
    return fs.readFileSync(this.filepath).toString();
  }

  // return the contents of the file as an array of words
  readWords() {
    return (new Tokenizer).tokenize(this.read());
  }
}

// Tally - responsible for tally up the words and getting the top 10 words
class Tally {
  // contructor of tally takes in an array of words
  constructor(words) {
    this.words = words;
    this.tallyUp();
  }

  // tallies up the words into this.tally, in addition to taking
  // the top 10 results and storing that in this.tallyAsArray
  tallyUp() {
    this.tally = {};

    for (let i = 0; i < this.words.length; i++) {
      let word = this.words[i].toLowerCase();
      this.tally[word] = (this.tally[word] || 0) + 1;
    }

    this.tallyAsArray = [];
    for (let word in this.tally) {
      this.tallyAsArray.push({ word: word, count: this.tally[word] });
    }
    this.tallyAsArray.sort(function(one, other) {
      return other.count - one.count;
    });

    this.tallyAsArray.slice(0, 10);
  }

  // returns the top 10 results
  getTop10() {
    return this.tallyAsArray.slice(0, 10);
  }
}

// Top10Printer - given the top 10 results an array of objects
//   containing the "word" and "count" properties, displays them.
class Top10Printer {
  static print(top10) {
    console.log('The top 10 most frequently used:');
    console.log('--------------------------------');
    for (let i = 0; i < top10.length; i++) {
      let rank = i + 1;
      let entry = top10[i];
      console.log(rank + '. ' + entry.word + ': ' + entry.count); 
    }
  }
}

// WordCount - the top level program containing a main method
//   to be called below
class WordCount {
  static main() {
    let words = new FileReader('words.txt').readWords();
    let tally = new Tally(words);
    Top10Printer.print(tally.getTop10());
  }
}

WordCount.main();

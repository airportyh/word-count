"use strict"
const fs = require('fs');

class Tokenizer {
  tokenize(text) {
    return text.split(/[\s.,\/:\n]+/);
  }
}

class FileReader {
  constructor(filepath) {
    this.filepath = filepath;
  }

  read() {
    return fs.readFileSync(this.filepath).toString();
  }

  readWords() {
    return (new Tokenizer).tokenize(this.read());
  }
}

class Tally {
  constructor(words) {
    this.words = words;
    this.tallyUp();
  }

  tallyUp() {
    this.tally = {};

    // tallies up the words
    for (let i = 0; i < this.words.length; i++) {
      let word = this.words[i].toLowerCase(); // lowercase so 
                                              // that we merge 
                                              // different casing
      this.tally[word] = (this.tally[word] || 0) + 1;
    }

    // find the top 10
    this.tallyAsArray = [];
    for (let word in this.tally) {
      this.tallyAsArray.push([word, this.tally[word]]);
    }
    this.tallyAsArray.sort(function(one, other) {
      return other[1] - one[1];
    });

    this.tallyAsArray.slice(0, 10);
  }

  getTop(n) {
    return this.tallyAsArray.slice(0, n);
  }
}

class TopXPrinter {
  static print(topX) {
    console.log('The top 10 most frequently used:');
    console.log('--------------------------------');
    for (let i = 0; i < topX.length; i++) {
      let rank = i + 1;
      let pair = topX[i];
      let word = pair[0];
      let count = pair[1];
      console.log(rank + '. ' + word + ': ' + count); 
    }
  }
}

class WordCount {
  static main() {
    let words = new FileReader('words.txt').readWords();
    let tally = new Tally(words);
    TopXPrinter.print(tally.getTop(10));
  }
}

WordCount.main();

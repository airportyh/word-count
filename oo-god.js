"use strict"
const fs = require('fs');

class WordCount {
  constructor(filepath) {
    this.filepath = filepath;
  }

  static main() {
    let tally = new WordCount('words.txt');
    tally.printTop10();
  }

  top10() {
    let tally = this.tally();
    let tallyAsArray = [];
    for (let word in tally) {
      tallyAsArray.push([word, tally[word]]);
    }
    tallyAsArray.sort(function(one, other) {
      return other[1] - one[1];
    });
    return tallyAsArray.slice(0, 10);
  }

  tally() {
    let words = this.words();
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

  content() {
    return fs.readFileSync('words.txt').toString();
  }

  words() {
    return this.content().split(/[\s.,\/:\n]+/);
  }

  printTop10() {
    let top10 = this.top10();
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
}

WordCount.main();
/*
In this version of the program, we extend the concept of "pure"
even further as an exercise. A pure expression is an expression that has
no side effects. This program is based-on program 6, and it
maximizes the amount of code written in this "pure" form. With the
exception of 4 lines, every line in this program is a pure expression.
Moreover, almost the entire program has been written as one big
pure function: program.

Two of the support functions: sorted and merge - although have the
property of being pure functions, each contain non-pure expressions
within them. These were practically necessary due to limitations
of JavaScript.

This program also rewrites the display code in program 6, and now
represents it as a pure function which takes the top 10 results
and returns a string to be displayed.

However, this approach has resulted in one problem: the
program is now dog slow. See comments in the tallyUp function.
*/
"use strict"
const fs = require('fs');

const input = fs.readFileSync('words.txt').toString();  // impure code line 1
                                                        // because performs IO
const output = program(input);
console.log(output);                                    // impure code line 2
                                                        // because performs IO

/* ---- pure functions --------------- */

// program - takes a string as input - the text to be processed, 
//   and outputs a string - the text to be displayed to the console.
function program(text) {
  const words = splitWords(text);
  const tally = tallyUp(words);
  const top10 = getTop10(tally);
  return renderTop10(top10);
}

// splitWords is unchanged from program 6
function splitWords(text) {
  return text.split(/[\s.,\/:\n]+/);
}

function tallyUp(words) {
  return words
    .map(function(str) {
      return str.toLowerCase();
    })
    .reduce(function(tally, word) {
      // rather than modifying one tally object in place
      // this function returns a new tally object every time
      // thus making this a pure function. This change
      // causes the program to have to allocate many objects
      // during runtime, and has the effect of making it
      // very slow given large input
      return merge(tally, {
        [word]: (tally[word] || 0) + 1
      });
    }, {});
}

// getTop10 is unchanged from program 6
function getTop10(tally) {
  return sorted(Object.keys(tally)
    .map(function(word) {
      return { word: word, count: tally[word] };
    }), function(one, other) {
      return other.count - one.count;
    }).slice(0, 10);
}

// sorted - a pure function which returns the sorted version
//   of the passed in array with the given compare function
function sorted(arr, compare) {
  return arr.slice(0).sort(compare);    // impure line 3 because
                                        // the sort method of
                                        // the array modifies
                                        // the original array
}

// merge - a pure function which returns a new object as the
//   result of merging the keys/values of two passed in objects.
function merge(obj1, obj2) {
  return Object.assign({}, obj1, obj2); // impure line 4
                                        // because Object.assign
                                        // modifies its first
                                        // parameter
}

// renderTop10 - given an array of top 10 results - containing
//   the keys "word" and "count", returns a string containing
//   the results to be displayed onto the console. In contrast
//   to printTop10 in program 6, which prints the results
//   directly to the screen, renderTop10 does not print the
//   results, but rather just returns the string to be displayed.
function renderTop10(top10) {
  return [
    'The top 10 most frequently used:',
    '--------------------------------'
  ].concat(
    top10.map(function(entry, rank) {
      return rank + '. ' + entry.word + ': ' + entry.count;
    })
  ).join('\n');
}
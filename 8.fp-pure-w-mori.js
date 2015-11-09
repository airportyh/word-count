/*
This version of the program uses mori (https://github.com/swannodette/mori),
a JavaScript library which supports effecient use of immutable data
structures in order to help us to write "pure" programs without
suffering a lot of performance penalty.

Mori has a functional-style (read non-object-oriented) API,
which means that all of its functions are meant to be used as
functions, not methods ( no dot operator ). Whereas before, 
with JS arrays, we had `arr.map(func)`. With mori, we have 
`map(func, arr)`. Notice also that the subject - the array in
this case - is usually the last parameter, which will come into
play later when we introduce currying.

Mori's API docs are at http://swannodette.github.io/mori/

The program takes full advantage
of the library's features - using 13 functions from its API.

*/
"use strict"
const fs = require('fs');
const mori = require('mori');

// For convinience, I have aliased all of the mori functions I need
// to the top level.
const map = mori.map;
const list = mori.list;
const hashMap = mori.hashMap;
const assoc = mori.assoc;
const reduce = mori.reduce;
const get = mori.get;
const sort = mori.sort;
const first = mori.first;
const last = mori.last;
const take = mori.take;
const zipmap = mori.zipmap;
const range = mori.range;
const concat = mori.concat;

// The following 3 lines are the main program, in the same manner as
// program 7.
const input = fs.readFileSync('words.txt').toString();
const output = program(input);
console.log(output);

// Again, the bulk of the program has been written as one pure
// function. Since all of the code has been rewritten, I will 
// give line-by-line commentary.
function program(input) {
  // split the input text into a list (a mori data structure) of
  // words
  const words = splitWords(input);
  // lower-case each word
  const lowerCased = map(toLowerCase, words);
  // tally each word into a hash map (another mori data structure)
  const tally = reduce(function(tally, word) {
    // The assoc function takes the tally, and sets its entry
    // keyed by word to the new value. However, it does not 
    // modify the original tally object, but rather returns
    // a new hash map with the would-be value. The one difference
    // between this function and the merge function in program 7
    // is that this is fast, while merge is slow. How does mori
    // manage to make this fast? By sharing data among multiple
    // instances of hash maps under the hood.
    // Watch this David Nolen talk for details:
    //   https://www.youtube.com/watch?v=SiFwRtCnxv4
    //
    // the get method gets the value within a tally by a key
    // and in the case that the key doesn't exist, returns the
    // default value as passed in in the 3rd argument.
    return assoc(tally, word, get(tally, word, 0) + 1);
  }, hashMap(), lowerCased);
  // sort tally - which is a mori hash map, which incidentally
  // supports sorting directly, so no need to convert this
  // to something else.
  const sorted = sort(compareDesc, tally);
  // take the first 10 items of the hash map
  const top10 = take(10, sorted);
  // the following 4 steps render the results into a string
  // to printed to the console.
  // First, since we want to print the rank of each word
  // as a number, and mori doesn't give an index when
  // we map through it, we need to inject the ranks manually.
  // We first use range to get a list of numbers from 1 to 10,
  // then we use zipmap to pair each number with each result.
  // so we have ((1, <result>), (2, <result>), (3, <result>), ...)
  const top10WithRank = zipmap(range(1, 11), top10);
  // now we can use map to convert each pair into a string
  // using the renderResult function
  const resultLines = map(renderResult, top10WithRank);
  // add 2 header lines to the top of the result lines
  const lines = concat(header(), resultLines);
  // join all the lines using newlines as the separator
  const output = join('\n', lines);
  return output;
}

function splitWords(str) {
  return list.apply(null, str.split(/[\s.,\/:\n]+/));
}

function compareDesc(one, other) {
  return last(other) - last(one);
}

function header() {
  return [
    'The top 10 most frequently used:',
    '--------------------------------'
  ];
}

// because mori lists do not support a .join method as
// JavaScript arrays do, I've implemented join here
function join(sep, list) {
  return reduce(function(str, part) {
    if (str === '') {
      return part;
    } else {
      return str + sep + part;
    }
  }, '', list);
}

// render one top-10 result as a line in the console
function renderResult(entry) {
  let rank = first(entry);
  let pair = last(entry);
  let word = first(pair);
  let count = last(pair);
  return rank + '. ' + word + ': ' + count;
}

function toLowerCase(str) {
  return str.toLowerCase();
}
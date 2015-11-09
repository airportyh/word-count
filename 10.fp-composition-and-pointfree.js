/*
This version of the program introduces the concept of function composition and
point-free programming.
https://en.wikipedia.org/wiki/Function_composition
https://en.wikipedia.org/wiki/Tacit_programming

To compose a function f with a function g is to "chain" the functions together as such:

  g(f(x))

You might get a new function h as the result of the composition:

  h(x) <=> g(f(x))

As you might imagine, you might also generalize this notion to any number of functions:

  step9(step8(step7(step6(step5(step4(step3(step2(step1(input)))))))))

Where have we seen that before? (program 9)

Mori has a comp function for our convinience, and we'll use it to refactor the code
in program 9.

The Point-free style of programming is a functional programming style where you
do without the use of any function parameters - this is now possible with extensive
use of partial function application and function composition.
*/
"use strict"
const fs = require('fs');
const mori = require('mori');
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
const partial = mori.partial;
const comp = mori.comp;

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

function join(sep, list) {
  return reduce(function(str, part) {
    if (str === '') {
      return part;
    } else {
      return str + sep + part;
    }
  }, '', list);
}

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

// Note that the following section - steps 1 - 9 are
// taken verbatim from program 9, but have been taking outside
// of the body of the program() function.
const step1 = partial(splitWords);
const step2 = partial(map, toLowerCase);
const step3 = partial(reduce, function(tally, word) {
  return assoc(tally, word, get(tally, word, 0) + 1);
}, hashMap());
const step4 = partial(sort, compareDesc);
const step5 = partial(take, 10);
const step6 = partial(zipmap, range(1, 11));
const step7 = partial(map, renderResult);
const step8 = partial(concat, header());
const step9 = partial(join, '\n');

// The program() function is simply the result of composing
// steps 1 - 9, in reverse order.
// Note that we have now implemented the body of the program()
// in the point-free style - there are no function parameters anywhere,
// only functions, function, and more functions.
const program = 
  comp(step9, step8, step7, step6, step5, step4, step3, step2, step1);

const input = fs.readFileSync('words.txt').toString();
const output = program(input);
console.log(output);
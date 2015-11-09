/*
This version of the program introduces the concept of currying.

Look back at the program() function of program 8, notice that 
on each line, a function is called, and then the result that is
returned by that function is immediately used as the last
argument of the function that is called on the very next line.
For example, first `splitWords(line)` was called, its results
were stored in words. Then on the next line, words is used in
map(toLowerCase, words) - as the second argument.

This property of the code lends itself to a new refactoring
pattern called currying. Another name for currying is partial
function application. To apply a function partially is to specify
the first n of its arguments and still leaving the rest of its
arguments open.

For example, given an add function:

  function add(x, y) {
    return x + y;
  }

We can partially apply add by specifying only the first of its
arguments to, say 2.

  let add2 = partial(add, 2);

The result would be a function add2 which takes just one number
and adds 2 to it.

  add2(4) => 6

Mori conviniently has a partial function, and the program() function
here has been refactored to use partial on all but one line.
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

const input = fs.readFileSync('words.txt').toString();
const output = program(input);
console.log(output);

function program(input) {
  // first operation is to split input into words
  const step1 = splitWords;
  // the words are feed into step2 to be lower cased
  const step2 = partial(map, toLowerCase);
  // the lower cased words are feed into step 3 to be tallied
  const step3 = partial(reduce, function(tally, word) {
    return assoc(tally, word, get(tally, word, 0) + 1);
  }, hashMap());
  // the tally is feed into step4 to be sorted in descending order
  const step4 = partial(sort, compareDesc);
  // the sorted tally is feed into step5 to be taken the top 10 of
  const step5 = partial(take, 10);
  // the top 10 results are feed into step6 to be zipped with the numbers 1 to 10
  const step6 = partial(zipmap, range(1, 11));
  // the ranked results are feed into step7 to be map into text lines to be displayed
  const step7 = partial(map, renderResult);
  // the text lines are feed into step8 to be concatenated with the header
  const step8 = partial(concat, header());
  // the text lines feed into step9 which joins the lines, separating them with newlines
  const step9 = partial(join, '\n');
  // finally, setting up these series of functions as one long pipe line:
  return step9(step8(step7(step6(step5(step4(step3(step2(step1(input)))))))));
}

function splitWords(str) {
  // list.apply converts the resulting array from the split
  // to a Mori list
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
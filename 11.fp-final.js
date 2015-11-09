/*
Explicitly listing out each step in the manner of programs 9 and 10 was done
delibrately to demonstrate currying and function composition. This program
reorganizes things semantically, closer to the way that program 2 is structured.
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

const words = comp(
  partial(map, toLowerCase),
  partial(splitWords)
);

const tally = partial(reduce, function(tally, word) {
  return assoc(tally, word, get(tally, word, 0) + 1);
}, hashMap());

const top10 = comp(
  partial(take, 10),
  partial(sort, compareDesc)
);

const render = comp(
  partial(join, '\n'),
  partial(concat, header()),
  partial(map, renderResult),
  partial(zipmap, range(1, 11))
);

const program = comp(render, top10, tally, words);

/* ----------- main program ---------- */

const input = fs.readFileSync('words.txt').toString();
const output = program(input);
console.log(output);
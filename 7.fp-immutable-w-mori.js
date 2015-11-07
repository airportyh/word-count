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
const toJs = mori.toJs;

main();

function main() {
  console.log(wordCount(fs.readFileSync('words.txt').toString()));
}

function wordCount(input) {
  return renderTop10(
    zipmap(
      range(1, 11), 
      take(10, 
        sort(compareDesc, 
          tally(
            map(toLowerCase, 
              splitWords(input)))))));
}

function compareDesc(one, other) {
  return last(other) - last(one);
}

function tally(words) {
  return reduce(function(tally, word) {
    return assoc(tally, word, get(tally, word, 0) + 1);
  }, hashMap(), words);
}

function toList(arr) {
  return list.apply(null, arr);
}

function splitWords(str) {
  return toList(str.split(/[\s.,\/:\n]+/));
}

function renderTop10(top10) {
  const rankWithTop10 = map(renderRank, top10)
    
  return toJs(concat([
    'The top 10 most frequently used:',
    '--------------------------------'
  ], rankWithTop10)).join('\n');
}

function renderRank(entry) {
  let rank = first(entry);
  let pair = last(entry);
  let word = first(pair);
  let count = last(pair);
  return rank + '. ' + word + ': ' + count;
}

function toLowerCase(str) {
  return str.toLowerCase();
}
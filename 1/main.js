const fs = require("fs");

function readInputLines() {
  return fs.readFileSync("input.txt").toString().split("\n");
}

function validPair(p) {
  return p.length === 2;
}

function dist(a, b) {
  return Math.abs(a - b);
}

function unmerge(line, { left, right }) {
  const pair = line.split(" ").map(Number).filter(Boolean);
  if (!validPair(pair)) return;

  left.push(pair[0]);
  right.push(pair[1]);
}

function parseLeftAndRight() {
  const lists = { left: [], right: [] };
  readInputLines().forEach((line) => unmerge(line, lists));

  lists.left.sort();
  lists.right.sort();

  return lists;
}

function sumDistances({ left, right }) {
  let total = 0;
  for (let i = 0; i < left.length; ++i) {
    total += dist(left[i], right[i]);
  }

  return total;
}

function freq(arr, el) {
  return arr.reduce((acc, cur) => acc + (el === cur ? 1 : 0), 0);
}

function solve() {
  const lr = parseLeftAndRight();
  const dists = sumDistances(lr);

  return dists;
}

function sumSimilarity({ left, right }) {
  const score = (arr, n) => n * freq(arr, n);
  const memo = {};

  let total = 0;
  for (let i = 0; i < left.length; ++i) {
    const n = left[i];
    if (memo[n] !== undefined) total += memo[n];
    else total += memo[n] = score(right, n);
  }

  return total;
}

function solve2() {
  const lr = parseLeftAndRight();
  const similarity = sumSimilarity(lr);

  return similarity;
}

console.log(solve());
console.log(solve2());

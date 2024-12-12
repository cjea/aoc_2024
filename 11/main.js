const fs = require("fs");

function readInput() {
  return fs.readFileSync("input.txt").toString().split(" ").map(Number);
}

const memo = {};

const memoized = (val, n) =>
  memo[val] !== undefined && memo[val][n] !== undefined;

const getMemo = (val, n) => (memoized(val, n) ? memo[val][n] : null);

const memoize = (val, n, sum) => {
  if (!memo[val]) memo[val] = {};
  memo[val][n] = sum;
};

function step(stone) {
  const str = String(stone);
  if (stone === 0) return [1];
  if (str.length % 2) return [stone * 2024];
  return [
    Number(str.slice(0, str.length / 2)),
    Number(str.slice(str.length / 2)),
  ];
}

function count(steps) {
  return (sum, val) => sum + countAfterSteps(val, steps);
}

function countAfterSteps(stone, steps) {
  if (typeof stone !== "number") return 0;
  if (steps < 1) return 1;
  if (!memoized(stone, steps)) {
    memoize(stone, steps, step(stone).reduce(count(steps - 1), 0));
  }

  return getMemo(stone, steps);
}

function countStones(stones, numSteps) {
  return stones.reduce((acc, cur) => acc + countAfterSteps(cur, numSteps), 0);
}

function solve() {
  const input = readInput();
  const n = countStones(input, 25);

  return n;
}

function solve2() {
  const input = readInput();
  const n = countStones(input, 75);

  return n;
}

console.log(solve());
console.log(solve2());

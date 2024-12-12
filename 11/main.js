const fs = require("fs");
/**
[ 5 127 680267 39260 0 26 3553 5851995 ]
5*2024, 127*2024, 680, 267, 39260
 */

function readInput() {
  return fs.readFileSync("input.txt").toString().split(" ").map(Number);
}

function step(stone) {
  const str = String(stone);
  if (stone === 0) return [1];
  if (str.length % 2) return [stone * 2024];
  return [
    Number(str.slice(0, str.length / 2)),
    Number(str.slice(str.length / 2)),
  ];
}

function steps(stone, n) {
  let line = [stone];
  for (let i = 1; i <= n; ++i) {
    line = line.flatMap(step);
  }

  return line;
}

function countStones(stones, num) {
  let total = 0;
  for (const stone of stones) {
    total += steps(stone, num).length;
  }

  return total;
}

function solve() {
  const input = readInput();
  console.log({ input });
  const n = countStones(input, 25);

  return n;
}

console.log(solve());

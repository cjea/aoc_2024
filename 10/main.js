const fs = require("fs");

function readInput() {
  return fs.readFileSync("input.txt").toString().split("\n");
}

function isTrailHead(char) {
  return char === 0;
}

function isTrailEnd(char) {
  return char === 9;
}

const vectors = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
];
function addVec([r1, c1], [r2, c2]) {
  return [r1 + r2, c1 + c2];
}

function getCoords(grid, [row, col]) {
  if (0 <= row && row < grid.length) return Number(grid[+row][+col]);

  return undefined;
}

function score(grid, coords) {
  const ends = new Set();
  const seen = (coords) => ends.add(coords.join(","));
  const distinctEnds = () => ends.size;

  const nextTarget = (coords) => getCoords(grid, coords) + 1;
  const neighbors = (coords) => {
    const target = nextTarget(coords);
    return vectors
      .map((vec) => addVec(vec, coords))
      .filter((neighbor) => getCoords(grid, neighbor) === target);
  };

  const queue = [coords];
  while (queue.length) {
    const cur = queue.shift();
    const char = getCoords(grid, cur);
    if (isTrailEnd(char)) {
      seen(cur);
      continue;
    }
    neighbors(cur).forEach((c) => queue.push(c));
  }

  return distinctEnds();
}

function sumTrailScores(input) {
  let total = 0;
  for (let row = 0; row < input.length; ++row) {
    for (let col = 0; col < input[row].length; ++col) {
      const coords = [row, col];
      if (!isTrailHead(getCoords(input, coords))) continue;

      total += score(input, coords);
    }
  }

  return total;
}

function solve() {
  const input = readInput();
  const n = sumTrailScores(input);

  return n;
}

console.log(solve());

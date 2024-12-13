const fs = require("fs");

function readInput() {
  return fs.readFileSync("input.txt").toString().split("\n");
}

const vectors = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

function translate([r1, c1], [r2, c2]) {
  return [r1 + r2, c1 + c2];
}
function at(grid, [row, col]) {
  if (0 <= row && row < grid.length) return grid[row][col];

  return null;
}
function sameRegion(grid, coords, neighbor) {
  return at(grid, coords) === at(grid, neighbor);
}

function neighborCoords(grid, coords) {
  return vectors
    .map((v) => translate(coords, v))
    .filter((c) => sameRegion(grid, coords, c));
}

function explore(grid, row, col, seen) {
  const state = { area: 0, perimeter: 0 };
  const see = (coords) => seen.add(coords.join(","));
  const been = (coords) => seen.has(coords.join(","));

  const queue = [[row, col]];
  while (queue.length) {
    cur = queue.shift();
    if (been(cur)) continue;

    see(cur);
    const neighbors = neighborCoords(grid, cur);
    state.perimeter += 4 - neighbors.length;
    state.area += 1;
    for (const n of neighbors) queue.push(n);
  }

  return state;
}

function calculateFencePrice(grid) {
  const seen = new Set();
  let total = 0;
  for (let row = 0; row < grid.length; ++row) {
    for (let col = 0; col < grid[row].length; ++col) {
      const { area, perimeter } = explore(grid, row, col, seen);
      total += area * perimeter;
    }
  }

  return total;
}

function solve() {
  const input = readInput();
  const price = calculateFencePrice(input);

  return price;
}

console.log(solve());

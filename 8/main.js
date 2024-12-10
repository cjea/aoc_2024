const fs = require("fs");

function readInput() {
  return fs.readFileSync("input.txt").toString().split("\n").filter(Boolean);
}

function move(grid, pos, step) {
  if (!pos) return pos;

  const r = pos[0] + step[0];
  const c = pos[1] + step[1];
  const rOk = 0 <= r && r < grid.length;
  const cOk = rOk && 0 <= c && c < grid[r].length;
  if (!cOk) return undefined;

  return [r, c];
}

function walkHarmonic(grid, node, otherNode, onFound) {
  const delta = ([r1, c1], [r2, c2]) => [r2 - r1, c2 - c1];

  let step;
  let pos;

  step = delta(node, otherNode);
  pos = node;
  while (pos) {
    onFound(pos.join(","));
    pos = move(grid, pos, step);
  }

  step = delta(otherNode, node);
  pos = otherNode;
  while (pos) {
    onFound(pos.join(","));
    pos = move(grid, pos, step);
  }
}

function walk(grid, node, otherNode, onFound) {
  const delta = ([r1, c1], [r2, c2]) => [r2 - r1, c2 - c1];

  let step;
  let pos;

  step = delta(node, otherNode);
  pos = node;
  pos = move(grid, pos, step);
  pos = move(grid, pos, step);

  if (pos) onFound(pos.join(","));

  step = delta(otherNode, node);
  pos = otherNode;
  pos = move(grid, pos, step);
  pos = move(grid, pos, step);

  if (pos) onFound(pos.join(","));
}

function scanFrequency(grid, frequency, antinodeMap, antinodeMapHarmonics) {
  const skip = (freq) => freq !== frequency || freq === "." || freq === "#";
  const indexes = new Set();

  for (let row = 0; row < grid.length; ++row) {
    for (let col = 0; col < grid[row].length; ++col) {
      const freq = grid[row][col];
      if (skip(freq)) continue;

      const key = `${row},${col}`;
      indexes.add(key);
    }
  }

  const decode = (key) => key.split(",").map(Number);
  const addAntinode = (key) => antinodeMap.add(key);
  const addHarmonicAntinode = (key) => antinodeMapHarmonics.add(key);

  const arr = [...indexes].map(decode);
  for (let i = 0; i < arr.length - 1; ++i) {
    for (let j = i + 1; j < arr.length; ++j) {
      walk(grid, arr[i], arr[j], addAntinode);
      walkHarmonic(grid, arr[i], arr[j], addHarmonicAntinode);
    }
  }
}

function countAntinodes(grid) {
  const antinodeMap = new Set();
  const antinodeMapHarmonics = new Set();
  const frequenciesDone = new Set();
  for (let row = 0; row < grid.length; ++row) {
    for (let col = 0; col < grid[row].length; ++col) {
      const frequency = grid[row][col];
      if (frequenciesDone.has(frequency)) continue;

      scanFrequency(grid, frequency, antinodeMap, antinodeMapHarmonics);
      frequenciesDone.add(frequency);
    }
  }

  return {
    antinodes: antinodeMap.size,
    antinodeHarmonics: antinodeMapHarmonics.size,
  };
}

function solve() {
  const grid = readInput();
  const total = countAntinodes(grid);

  return total;
}

console.log(solve());

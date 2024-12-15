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
const [right, down, left, up] = vectors;

function translate(c1, c2) {
  if (!c1 || !c2) return [-1, -1];

  return [c1[0] + c2[0], c1[1] + c2[1]];
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

function* walk(grid, row, col, seen) {
  const state = { area: 0, perimeter: 0 };
  const see = (coords) => seen.add(coords.join(","));
  const been = (coords) => seen.has(coords.join(","));

  const queue = [[row, col]];
  while (queue.length) {
    cur = queue.shift();
    if (been(cur)) continue;

    see(cur);
    yield cur;
    for (const n of neighborCoords(grid, cur)) queue.push(n);
  }

  return state;
}

function measure(grid, row, col, seen) {
  const state = { area: 0, perimeter: 0 };

  for (const coord of walk(grid, row, col, seen)) {
    state.perimeter += 4 - neighborCoords(grid, coord).length;
    state.area += 1;
  }

  return state;
}

function* runs(arr) {
  arr.sort((a, b) => a - b);
  let buf = [];
  for (let i = 0; i < arr.length; ++i) {
    const n = arr[i];
    const prev = buf[buf.length - 1];
    const seq = n === prev + 1;

    if (seq || !buf.length) {
      buf.push(n);
    } else {
      yield buf;
      buf = [n];
    }
  }

  if (buf.length) yield buf;
}

function countContinuousBorders(grid, run, dirs) {
  let total = 0;
  for (const dir of dirs) {
    let on = false;
    for (const coord of run) {
      if (sameRegion(grid, coord, translate(coord, dir))) {
        on = false;
        continue;
      }

      if (!on) total += 1;
      on = true;
    }
  }

  return total;
}

function measureContinuousBorders(grid, row, col, seen) {
  const state = { perimeter: 0, area: 0 };

  const rowToCols = {};
  const colToRows = {};
  const indexCoord = ([row, col]) => {
    if (!rowToCols[row]) rowToCols[row] = [];
    if (!colToRows[col]) colToRows[col] = [];
    rowToCols[row].push(col);
    colToRows[col].push(row);
  };

  for (const coord of walk(grid, row, col, seen)) {
    indexCoord(coord);
  }
  state.area = Object.values(rowToCols).flat().length;

  for (const [row, cols] of Object.entries(rowToCols)) {
    for (const run of runs(cols)) {
      const horiz = run.map((col) => [+row, col]);
      state.perimeter += countContinuousBorders(grid, horiz, [up, down]);
    }
  }

  for (const [col, rows] of Object.entries(colToRows)) {
    for (const run of runs(rows)) {
      const vert = run.map((row) => [row, +col]);
      state.perimeter += countContinuousBorders(grid, vert, [left, right]);
    }
  }

  return state;
}

function calculateFencePrice(grid) {
  const seen = new Set();
  let total = 0;
  for (let row = 0; row < grid.length; ++row) {
    for (let col = 0; col < grid[row].length; ++col) {
      const { area, perimeter } = measure(grid, row, col, seen);
      total += area * perimeter;
    }
  }

  return total;
}

function calculateFencePriceContinuous(grid) {
  const seen = new Set();
  let total = 0;
  for (let row = 0; row < grid.length; ++row) {
    for (let col = 0; col < grid[row].length; ++col) {
      const { area, perimeter } = measureContinuousBorders(
        grid,
        row,
        col,
        seen
      );
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

function solve2() {
  const input = readInput();
  const price = calculateFencePriceContinuous(input);

  return price;
}

console.log(solve());
console.log(solve2());

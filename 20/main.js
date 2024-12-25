const fs = require("fs");

const START = "S";
const END = "E";
const SPACE = ".";
const WALL = "#";

function readInput() {
  const fd = "input.txt";
  const lines = fs.readFileSync(fd).toString().split("\n");

  return lines.map((l) => l.split(""));
}

function at(grid, [r, c]) {
  if (0 <= r && r < grid.length) return grid[r][c];

  return undefined;
}

function isFree(grid, coord) {
  return [SPACE, START, END].includes(at(grid, coord));
}
function isWall(grid, coord) {
  return at(grid, coord) === WALL;
}
function isStart(grid, coord) {
  return at(grid, coord) === START;
}
function isEnd(grid, coord) {
  return at(grid, coord) === END;
}

const vectors = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

function translate([r1, c1], [r2, c2]) {
  return [r1 + r2, c1 + c2];
}

function neighbors(coord) {
  return vectors.map((v) => translate(v, coord));
}

function findStart(grid) {
  for (let r = 0; r < grid.length; ++r) {
    for (let c = 0; c < grid[r].length; ++c) {
      const pos = [r, c];
      if (isStart(grid, pos)) return pos;
    }
  }
}

function encode(coord) {
  return coord.join(",");
}

function markDistances(grid) {
  const start = findStart(grid);
  const seen = new Set();
  const been = (coord) => seen.has(encode(coord));
  const see = (coord) => seen.add(encode(coord));
  const neighborOf = (grid, coord) =>
    neighbors(coord).filter((n) => !been(n) && isFree(grid, n));

  const path = [start];
  see(start);
  while (!isEnd(grid, path[0])) {
    const [nxt] = neighborOf(grid, path[0]);
    see(nxt);
    path.unshift(nxt);
  }

  path.forEach(([r, c], index) => (grid[r][c] = index));
  return path;
}

function countShortcuts(grid) {
  const scores = grid.map((row) => row.slice());
  const path = markDistances(scores);
  const minTimeSaved = 100 + 2;

  function connectCheats(coord) {
    const maxTime = at(scores, coord) - minTimeSaved;
    const savesEnoughTime = (p) => at(scores, p) <= maxTime;
    const children = neighbors(coord)
      .filter((n) => isWall(scores, n))
      .flatMap((w) => neighbors(w).filter(savesEnoughTime));

    return { val: coord, children };
  }
  const nodes = path.map(connectCheats).filter((c) => c.children.length);

  return nodes.reduce((acc, cur) => acc + cur.children.length, 0);
}

function solve() {
  const grid = readInput();
  let count = countShortcuts(grid);

  return count;
}

console.log(solve());

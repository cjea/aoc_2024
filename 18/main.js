const fs = require("fs");
const ROWS = 71;
const COLS = 71;

const FREE = ".";
const WALL = "#";

function readInput() {
  const fd = "input.txt";
  const lines = fs.readFileSync(fd).toString().split("\n");

  return lines.map((line) => line.split(",").map(Number));
}

function encode(coord) {
  return coord.join(",");
}

function cover({ rows, cols, corrupt }) {
  const s = new Set(corrupt.map(encode));
  const isCorrupt = (coord) => s.has(encode(coord));
  const char = (coord) => (isCorrupt(coord) ? WALL : FREE);

  return new Array(rows)
    .fill(null)
    .map((_, r) => new Array(cols).fill(null).map((_, c) => char([r, c])));
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

function at(board, [r, c]) {
  if (0 <= r && r < board.length) return board[r][c];

  return undefined;
}

function isFree(board, coord) {
  return at(board, coord) === FREE;
}

function isWall(board, coord) {
  return at(board, coord) === WALL;
}

function neighbors(board, coord) {
  return vectors
    .map((v) => translate(coord, v))
    .filter((coord) => isFree(board, coord));
}

function shortestPath(board) {
  const target = encode([ROWS - 1, COLS - 1]);
  const done = (node) => encode(node.pos) === target;

  const seen = new Set();
  const see = (node) => seen.add(encode(node.pos));
  const been = (node) => seen.has(encode(node.pos));

  let lowest = { steps: Infinity };
  const submit = (node) => {
    if (lowest.steps > node.steps) lowest = node;
  };
  const queue = [{ pos: [0, 0], steps: 0 }];
  while (queue.length) {
    const cur = queue.shift();
    if (been(cur)) continue;
    if (done(cur)) {
      submit(cur);
      break;
    }

    see(cur);
    for (const n of neighbors(board, cur.pos)) {
      queue.push({ pos: n, steps: cur.steps + 1 });
    }
  }

  return lowest;
}

function solve() {
  const input = readInput();
  const board = cover({
    rows: ROWS,
    cols: COLS,
    corrupt: input.slice(0, 1 << 10),
  });
  const steps = shortestPath(board);

  console.log(board.map((row) => row.join(" ")).join("\n"));
  return steps;
}

console.log(solve());

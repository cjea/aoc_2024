const fs = require("fs");

function range(arr, lo, f) {
  for (let hi = lo; hi < arr.length; ++hi) {
    if (f(arr[hi])) return arr.slice(lo, hi + 1);
  }

  return arr.slice(lo);
}

function readInput() {
  const fd = "test_input.txt";
  const lines = fs.readFileSync(fd).toString().split("\n");
  const board = range(lines, 0, (l) => l.length === 0)
    .filter(Boolean)
    .map((l) => l.split(""));
  const moves = lines.slice(board.length + 1).join("");

  return { board, moves };
}

function isPlayer(c) {
  return c === "@";
}

function isBox(c) {
  return c === "O";
}

function isWall(c) {
  return c === "#" || c == null;
}

function isFree(c) {
  return c === ".";
}

function swap(board, c1, c2) {
  const tmp = at(board, c1);
  board[c1[0]][c1[1]] = at(board, c2);
  board[c2[0]][c2[1]] = tmp;
}

const vectors = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];
const [up, right, down, left] = vectors;
const dirs = { "^": up, ">": right, v: down, "<": left };

function translate([r1, c1], [r2, c2]) {
  return [r1 + r2, c1 + c2];
}
function at(board, [row, col]) {
  if (0 <= row && row < board.length) return board[row][col];

  return undefined;
}

function findPlayer(board) {
  for (let r = 0; r < board.length; ++r) {
    for (let c = 0; c < board[r].length; ++c) {
      if (isPlayer(board[r][c])) return [r, c];
    }
  }
}

function nearestFreeSpace(board, cur, v) {
  while (!isWall(at(board, cur))) {
    cur = translate(cur, v);
    if (isFree(at(board, cur))) return { ok: true, free: cur };
  }

  return { ok: false };
}

function playMove(board, move) {
  const player = findPlayer(board);
  const v = dirs[move];
  if (!v) throw new Error("Invalid move: " + move);

  const { ok, free } = nearestFreeSpace(board, player, v);
  if (!ok) return;

  const nxt = translate(player, v);
  if (isBox(at(board, nxt))) swap(board, nxt, free);

  swap(board, player, nxt);
}

function play(board, moves) {
  for (let i = 0; i < moves.length; ++i) {
    playMove(board, moves[i]);
  }
}

function gpsCoordinateSum(input) {
  const { board, moves } = input;
  play(board, moves);

  let total = 0;
  for (let r = 0; r < board.length; ++r) {
    for (let c = 0; c < board[r].length; ++c) {
      if (isBox(at(board, [r, c]))) total += 100 * r + c;
    }
  }

  return total;
}

function solve() {
  const input = readInput();
  const coordinateSum = gpsCoordinateSum(input);
  console.log(input.board.map((l) => l.join(" ")).join("\n"));

  return coordinateSum;
}

function solve2() {
  const input = readInput();
  const coordinateSum = gpsCoordinateSum(input);
  console.log(input.board.map((l) => l.join(" ")).join("\n"));

  return coordinateSum;
}

console.log(solve());
console.log(solve2());

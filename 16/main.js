const fs = require("fs");

function readInput() {
  const fd = "input.txt";
  const lines = fs.readFileSync(fd).toString().split("\n");

  return lines.filter(Boolean).map((l) => l.split(""));
}

const vectors = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];
const vhandles = vectors.map((_, i) => i);
const [uhandle, rhandle, dhandle, lhandle] = vhandles;
const vec = (vhandle) => vectors[vhandle];
const INITIAL_DIRECTION = rhandle;

const isStart = (c) => c === "S";
const isEnd = (c) => c === "E";
const isWall = (c) => c === "#";

function find(grid, f) {
  for (let r = 0; r < grid.length; ++r) {
    for (let c = 0; c < grid[r].length; ++c) {
      if (f(grid[r][c])) return [r, c];
    }
  }
}

function translate([r1, c1], [r2, c2]) {
  return [r1 + r2, c1 + c2];
}

function at(grid, [r, c]) {
  if (0 <= r && r < grid.length) return grid[r][c];

  return undefined;
}

function rotate(handle1, handle2) {
  if (handle1 % 2 !== handle2 % 2) return 1;
  return Math.abs(handle2 - handle1);
}

const TURN_FACTOR = 1000;
function turnScore(degrees) {
  return TURN_FACTOR * degrees;
}

function routes(grid) {
  const graph = {};
  const toId = (pos) => pos.join(",");
  const toPos = (id) => id.split(",").map(Number);
  const nodeAt = (id) => {
    if (id == null) return null;

    if (!graph[id]) graph[id] = { id, pos: toPos(id), children: [] };
    return graph[id];
  };

  const setChildren = (id, children) => {
    nodeAt(id).children = children.map(nodeAt);
  };

  const childKey = (pos) => {
    const val = at(grid, pos);
    if (!val || isWall(val)) return null;

    return toId(pos);
  };

  for (let r = 0; r < grid.length; ++r) {
    for (let c = 0; c < grid[r].length; ++c) {
      setChildren(
        toId([r, c]),
        vhandles.map((v) => childKey(translate([r, c], vec(v))))
      );
    }
  }

  return { nodeAt, toId };
}

function lowestMazeCost(grid) {
  const { nodeAt, toId } = routes(grid);
  const start = nodeAt(toId(find(grid, isStart)));

  const memo = {};
  const mKey = (pos, dir) => toId(pos) + "," + dir;
  const mGet = (pos, dir) => memo[mKey(pos, dir)] || Infinity;
  const mSet = (pos, dir, score) => {
    const key = mKey(pos, dir);
    memo[key] = Math.min(score, mGet(pos, dir));
  };

  let lowest = { score: Infinity };
  const submit = (state) => {
    if (state.score < lowest.score) lowest = state;
  };

  const queue = [{ path: [start.id], score: 0, dir: INITIAL_DIRECTION }];
  while (queue.length) {
    const cur = queue.shift();
    const id = cur.path[cur.path.length - 1];
    const { pos, children } = nodeAt(id);
    if (mGet(pos, cur.dir) <= cur.score) continue;

    mSet(pos, cur.dir, cur.score);
    if (isEnd(at(grid, pos))) {
      submit(cur);
      continue;
    }
    for (let i = 0; i <= 3; ++i) {
      if (!children[i]) continue;

      queue.push({
        path: cur.path.concat(children[i].id),
        score: cur.score + turnScore(rotate(cur.dir, i)) + 1,
        dir: vhandles[i],
      });
    }
  }

  return lowest;
}

function solve() {
  const input = readInput();
  const { score } = lowestMazeCost(input);

  return score;
}

console.log(solve());

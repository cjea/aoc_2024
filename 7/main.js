const fs = require("fs");

function readInput() {
  const fd = "input.txt";
  const raw = fs.readFileSync(fd).toString().split("\n");
  const map = {};
  for (const line of raw) {
    if (!line.length) continue;

    const [key, vals] = line.split(":");
    const nums = vals.split(" ").map(Number).filter(Boolean);
    map[key] = nums;
  }

  return map;
}

function plus(n) {
  return { val: n, apply: (a) => a + n };
}
function mult(n) {
  return { val: n, apply: (a) => a * n };
}
function conc(n) {
  return { val: n, apply: (a) => Number("" + a + n) };
}

function canSolve(nums, ops, target) {
  const queue = [{ used: 1, total: nums[0] }];
  while (queue.length) {
    const { used, total } = queue.shift();
    if (total > target) continue;
    if (total === target && used === nums.length) return true;

    if (used < nums.length) {
      const apply = (op) => op(nums[used]).apply(total);
      for (const newTotal of ops.map(apply)) {
        queue.push({ total: newTotal, used: used + 1 });
      }
    }
  }

  return false;
}

function sumSolvableEquations(input, ops) {
  let total = 0;

  for (const key of Object.keys(input)) {
    const nums = input[key];
    const target = Number(key);
    if (canSolve(nums, ops, target)) total += target;
  }

  return total;
}

function solve() {
  const input = readInput();
  const total = sumSolvableEquations(input, [plus, mult]);

  return total;
}

function solve2() {
  const input = readInput();
  const total = sumSolvableEquations(input, [plus, mult, conc]);

  return total;
}

console.log(solve());
console.log(solve2());

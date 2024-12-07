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

function canSolve(nums, target) {
  const queue = [{ used: 1, total: nums[0] }];

  while (queue.length) {
    const { used, total } = queue.shift();
    if (total > target) continue;
    if (total === target && used === nums.length) return true;

    if (used < nums.length) {
      queue.push({ used: used + 1, total: total + nums[used] });
      queue.push({ used: used + 1, total: total * nums[used] });
    }
  }

  return false;
}

function sumSolvableEquations(input) {
  let total = 0;
  for (const key of Object.keys(input)) {
    const nums = input[key];
    const target = Number(key);
    if (canSolve(nums, target)) total += target;
  }

  return total;
}

function solve() {
  const input = readInput();
  const total = sumSolvableEquations(input);

  return total;
}

console.log(solve());

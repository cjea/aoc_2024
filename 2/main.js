const fs = require("fs");
const LOWER_BOUND = 1;
const UPPER_BOUND = 3;

function parseInputLines() {
  return fs
    .readFileSync("input.txt")
    .toString()
    .split("\n")
    .map((line) => line.split(" ").map(Number).filter(Boolean))
    .filter((nums) => nums.length > 0);
}

function allIncreasing(nums) {
  for (let i = 0; i < nums.length - 1; ++i) {
    if (nums[i] <= nums[i + 1]) return false;
  }
  return true;
}

function allDecreasing(nums) {
  for (let i = 0; i < nums.length - 1; ++i) {
    if (nums[i] >= nums[i + 1]) return false;
  }
  return true;
}

function gradual(from, to) {
  const dist = Math.abs(from - to);
  return LOWER_BOUND <= dist && dist <= UPPER_BOUND;
}

function allGradual(nums) {
  for (let i = 0; i < nums.length - 1; ++i) {
    if (!gradual(nums[i], nums[i + 1])) return false;
  }
  return true;
}

function safe(nums) {
  return (allIncreasing(nums) || allDecreasing(nums)) && allGradual(nums);
}

function dropEachOnce(arr) {
  return arr.map((_, i) => arr.filter((_, idx) => i !== idx));
}

function safeWithTolerance(nums) {
  return [nums, ...dropEachOnce(nums)].some(safe);
}

function countSafeReports() {
  const lines = parseInputLines();
  return lines.filter(safe).length;
}

function countSafeReportsWithTolerance() {
  const lines = parseInputLines();
  return lines.filter(safeWithTolerance).length;
}

function solve() {
  return countSafeReports();
}

function solve2() {
  return countSafeReportsWithTolerance();
}

console.log(solve());
console.log(solve2());

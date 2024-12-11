const fs = require("fs");

function readInput() {
  return fs.readFileSync("input.txt").toString().split("\n")[0];
}

function lastFileIndex(str) {
  return str.length % 2 ? str.length - 1 : str.length - 2;
}

function calcFileId({ length }) {
  return ~~(length / 2) + (length % 2) - 1;
}

function at(str, idx) {
  return Number(str[idx]);
}

function fillBuffer(id, blocks) {
  return { id, blocks };
}

function add(virtualIndex, buffer) {
  let total = 0;
  for (let i = 0; i < buffer.blocks; ++i) {
    const n = (virtualIndex + i) * buffer.id;
    total += n;
  }
  virtualIndex += buffer.blocks;
  return total;
}

function calculateChecksum(str) {
  const initBorrowBuffer = () => {
    borrow.id = calcFileId(str);
    borrow.index = lastFileIndex(str);
    borrow.blocks = at(str, borrow.index);
  };
  const nullifyBorrowBuffer = () => {
    borrow.id = null;
    borrow.index = null;
    borrow.blocks = null;
  };

  const borrowBlocks = (num) => {
    borrow.blocks -= num;
    if (borrow.blocks < 1) {
      borrow.id -= 1;
      borrow.index -= 2;
      borrow.blocks = at(str, borrow.index);
    }
  };

  let slots;
  let globalIndex = 0;
  let fileId = 0;

  const borrow = { id: null, index: null, blocks: null };
  let buffer = { id: fileId, blocks: at(str, globalIndex) };
  let virtualIndex = 0;
  let checksum = 0;

  initBorrowBuffer();

  while (globalIndex < borrow.index) {
    const fileId = calcFileId({ length: globalIndex + 1 });
    buffer = fillBuffer(fileId, at(str, globalIndex));
    checksum += add(virtualIndex, buffer);
    virtualIndex += buffer.blocks;

    globalIndex += 1;
    slots = at(str, globalIndex);

    while (slots && borrow.id) {
      const used = Math.min(slots, borrow.blocks);
      buffer = fillBuffer(borrow.id, used);
      checksum += add(virtualIndex, buffer);
      virtualIndex += buffer.blocks;

      slots -= used;
      borrowBlocks(used);
      if (borrow.index < globalIndex) nullifyBorrowBuffer();
    }
    globalIndex += 1;
  }

  if (borrow.id) {
    buffer = fillBuffer(borrow.id, borrow.blocks);
    checksum += add(virtualIndex, buffer);
    virtualIndex += buffer.blocks;
  }

  return checksum;
}

/**
  Couldn't figure out how to adapt the part 1 strategy.
  Do it the literal way instead of greedy aggregation.
 */
function calculateChecksumWithoutFragments(str) {
  const parse = (el, i) =>
    i % 2
      ? { slots: Number(el) }
      : { id: calcFileId({ length: i + 1 }), blocks: Number(el) };

  const input = str.split("").map(parse);
  for (let i = input.length - 1; i >= 2; --i) {
    const file = input[i];
    if (!file.id) continue;

    let found = false;
    for (let j = 1; j < i && !found; ++j) {
      const slots = input[j];
      if (!input[j].slots) continue;
      if (slots.slots < file.blocks) continue;
      if (slots.slots === file.blocks) {
        found = true;
        input[j] = file;
        input[i] = { slots: file.blocks };
      }
      if (slots.slots > file.blocks) {
        found = true;
        slots.slots -= file.blocks;
        input[i] = { slots: file.blocks };

        input.splice(j, 0, file);
        ++i;
      }
    }
  }

  let virtualIndex = 0;
  let checksum = 0;
  for (let i = 0; i < input.length; ++i) {
    if (input[i].slots !== undefined) {
      virtualIndex += input[i].slots;
      continue;
    }
    const b = fillBuffer(input[i].id, input[i].blocks);
    const toAdd = add(virtualIndex, b);

    checksum += toAdd;
    virtualIndex += input[i].blocks;
  }

  return checksum;
}

function solve() {
  const input = readInput();
  const checksum = calculateChecksum(input);

  return checksum;
}

function solve2() {
  const input = readInput();
  const checksum = calculateChecksumWithoutFragments(input);

  return checksum;
}

console.log(solve());
console.log(solve2());

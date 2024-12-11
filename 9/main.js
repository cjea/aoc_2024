const fs = require("fs");

function readInput() {
  return fs.readFileSync("input.txt").toString().split("\n")[0];
}

function lastFileIndex(str) {
  return str.length % 2 ? str.length - 1 : str.length - 2;
}

function maxFileId(str) {
  const twosIdx = str.length / 2 - 1;
  return ~~twosIdx + (str.length % 2);
}

function calculateChecksum(str) {
  const at = (idx) => Number(str[idx]);

  const fillBuffer = (id, blocks) => {
    buffer.id = id;
    buffer.blocks = blocks;
  };

  const add = () => {
    for (let i = 0; i < buffer.blocks; ++i) {
      const n = (virtualIndex + i) * buffer.id;
      checksum += n;
    }
    virtualIndex += buffer.blocks;
  };

  const initBorrowBuffer = () => {
    borrow.id = maxFileId(str);
    borrow.index = lastFileIndex(str);
    borrow.blocks = at(borrow.index);
  };

  const borrowBlocks = (num) => {
    borrow.blocks -= num;
    if (borrow.blocks < 1) {
      borrow.id -= 1;
      borrow.index -= 2;
      borrow.blocks = at(borrow.index);
    }
    if (borrow.index < globalIndex) {
      borrow.id = null;
      borrow.index = null;
      borrow.blocks = null;
    }
  };

  let slots;
  let globalIndex = 0;
  let fileId = 0;

  const borrow = { id: null, index: null, blocks: null };
  const buffer = { id: fileId, blocks: Number(str[globalIndex]) };
  let virtualIndex = 0;
  let checksum = 0;

  initBorrowBuffer();

  while (globalIndex < borrow.index) {
    fillBuffer(fileId, at(globalIndex));
    add();

    globalIndex += 1;
    slots = at(globalIndex);

    while (slots && borrow.id) {
      const used = Math.min(slots, borrow.blocks);
      fillBuffer(borrow.id, used);
      add();

      borrowBlocks(used);
      slots -= used;
    }
    globalIndex += 1;
    fileId += 1;
  }

  if (borrow.id) {
    fillBuffer(borrow.id, borrow.blocks);
    add();
  }

  return checksum;
}

function solve() {
  const input = readInput();
  const checksum = calculateChecksum(input);

  return checksum;
}

console.log(solve());

const fs = require("fs");
const TOKENS = {
  _HOLD: 0,
  MUL: 1,
  LPAREN: 2,
  RPAREN: 3,
  COMMA: 4,
  DIGITS: 5,
  DO: 6,
  DONT: 7,
};

function readInput() {
  return fs.readFileSync("input.txt").toString();
}

function isDigit(char) {
  return (
    char === "0" ||
    char === "1" ||
    char === "2" ||
    char === "3" ||
    char === "4" ||
    char === "5" ||
    char === "6" ||
    char === "7" ||
    char === "8" ||
    char === "9"
  );
}

function parseToken(raw, pos, tok) {
  switch (tok) {
    case TOKENS.MUL: {
      return raw.slice(pos, pos + 3) === "mul" ? "mul" : false;
    }
    case TOKENS.LPAREN: {
      return raw[pos] === "(" ? "(" : false;
    }
    case TOKENS.RPAREN: {
      return raw[pos] === ")" ? ")" : false;
    }
    case TOKENS.COMMA: {
      return raw[pos] === "," ? "," : false;
    }
    case TOKENS.DIGITS: {
      if (!isDigit(raw[pos])) return false;
      let idx = pos;
      while (isDigit(raw[idx])) ++idx;

      return raw.slice(pos, idx);
    }
    case TOKENS.DO: {
      return raw.slice(pos, pos + 4) === "do()" ? "do()" : false;
    }
    case TOKENS.DONT: {
      return raw.slice(pos, pos + 7) === "don't()" ? "don't()" : false;
    }
  }
}

function sumMultiplications(raw) {
  const { MUL, LPAREN, RPAREN, DIGITS, COMMA } = TOKENS;
  let total = 0;
  let left = undefined;
  let right = undefined;
  let pos = 0;
  const p = (tok) => parseToken(raw, pos, tok);

  while (pos < raw.length) {
    const mul = p(MUL);
    if (mul === false) {
      pos++;
      continue;
    }
    pos += mul.length;

    const lpar = p(LPAREN);
    if (lpar === false) continue;
    pos += lpar.length;

    const l = p(DIGITS);
    if (l === false) continue;
    pos += l.length;
    left = Number(l);

    const comma = p(COMMA);
    if (comma === false) continue;
    pos += comma.length;

    const r = p(DIGITS);
    if (r === false) continue;
    pos += r.length;
    right = Number(r);

    const rpar = p(RPAREN);
    if (rpar === false) continue;
    pos += rpar.length;

    total += left * right;
  }

  return total;
}

function sumMultiplicationsDo(raw) {
  const { MUL, LPAREN, RPAREN, DIGITS, COMMA, DO, DONT } = TOKENS;
  let total = 0;
  let on = true;
  let left = undefined;
  let right = undefined;
  let pos = 0;
  const p = (tok) => parseToken(raw, pos, tok);

  while (pos < raw.length) {
    if (!on) {
      const turnOn = p(DO);
      if (turnOn === false) {
        pos++;
        continue;
      }
      pos += turnOn.length;
      on = true;
    }

    const turnOff = p(DONT);
    if (turnOff !== false) {
      pos += turnOff.length;
      on = false;
      continue;
    }

    const mul = p(MUL);
    if (mul === false) {
      pos++;
      continue;
    }
    pos += mul.length;

    const lpar = p(LPAREN);
    if (lpar === false) continue;
    pos += lpar.length;

    const l = p(DIGITS);
    if (l === false) continue;
    pos += l.length;
    left = Number(l);

    const comma = p(COMMA);
    if (comma === false) continue;
    pos += comma.length;

    const r = p(DIGITS);
    if (r === false) continue;
    pos += r.length;
    right = Number(r);

    const rpar = p(RPAREN);
    if (rpar === false) continue;
    pos += rpar.length;

    total += left * right;
  }

  return total;
}

function solve() {
  const input = readInput();
  return sumMultiplications(input);
}

function solve2() {
  const input = readInput();
  return sumMultiplicationsDo(input);
}

console.log(solve());
console.log(solve2());

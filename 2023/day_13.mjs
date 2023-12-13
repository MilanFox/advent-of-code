import fs from 'fs';

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .split('\n\n')
  .filter(Boolean)
  .map(chunk => {
    const rows = chunk.split('\n').filter(Boolean);
    const columns = Array.from({length: rows[0].length}, (value, i) => rows.reduce((acc, cur) => acc + cur[i], ""));
    return {rows, columns}
  })

const symmetries = inputData.map(({rows, columns}) => {
  let symmetryScore = undefined;
  const checkForSymmetry = (stack, multiplier, start = 1, position = 0) => {
    const a = stack[start - position - 1];
    const b = stack[start + position];
    if (!a || !b) return;
    if (a !== b) {
      symmetryScore = undefined;
      if (start !== stack.length - 1) checkForSymmetry(stack, multiplier, start + 1)
      return
    }
    symmetryScore = start * multiplier;
    checkForSymmetry(stack, multiplier, start, position + 1)
  }

  checkForSymmetry(rows, 100);
  if (!symmetryScore) checkForSymmetry(columns, 1);
  return symmetryScore;
})

console.log(`Part 1: ${symmetries.reduce((acc, cur) => acc + cur, 0)}`);

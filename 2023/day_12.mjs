import fs from 'fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').split('\n').filter(Boolean).map(line => line.split(' '));
inputData.forEach(line => line[1] = line[1].split(',').map(n => parseInt(n, 10)));

const possibleSolutions = inputData.map(([record, condition]) => {
  const forkStack = [];
  let checkedForks = [];
  const matches = [];
  let match = [];
  let i = 0;

  const addMatchToList = () => { matches.push(match.join('')) };
  const recordChar = ( char ) => { match.push(char) };
  const defineFork = () => {
    forkStack.push(i);
    checkedForks.push(i);
  };
  const resetIndexToLastFork = () => {
    i = forkStack.pop();
    checkedForks = [i];
    match.length = i;
  };

  while (true) {
    if ( i === record.length && forkStack.length === 0 ) {
      addMatchToList();
      break;
    }

    if (i === record.length) {
      addMatchToList();
      resetIndexToLastFork();
      continue;
    }

    const char = match[i] || record[i];

    if (char !== "?") {
      recordChar(char)
      i += 1;

      continue;
    }

    if (!checkedForks.includes(i)) {
      defineFork();
      recordChar(".");
    } else {
      recordChar("#");
    }

    i += 1;
  }

  return matches.filter(match => {
    const groups = match.split(/\./).filter(Boolean);
    return groups.length === condition.length && groups.every((group, index) => group.length === condition[index])
  })
});

const sumOfPossibleSolutions = possibleSolutions
  .map(solutions => solutions.length)
  .reduce((acc, cur) => (acc || 0) + cur )

console.log(`Part 1: ${sumOfPossibleSolutions}`);

/* Absolutely no idea for Part 2... Not even going to try the brute forcing. So long, gold star streak. */

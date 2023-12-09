import fs from 'fs';

let inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .split("\n")
  .filter(Boolean)
  .map(line => line.split(' ').map(n => parseInt(n)));

const sum = (acc, cur) => (acc || 0) + cur;

const breakDownSequence = (seq) => {
  const steps = [seq];
  while (!steps[steps.length - 1].every(n => n === 0)) {
    steps.push(steps[steps.length - 1].map((n, i, arr) => arr[i + 1] - n).slice(0, -1));
  }
  return steps;
};

const findNextValue = (seq) => {
  const structure = breakDownSequence(seq).toReversed();
  structure.forEach((element, i) => {
    if(i === structure.length - 1) return;
    structure[i+1].push(element.at(-1) + structure[i+1].at(-1))
  })
  return structure.at(-1).at(-1);
}

const allNextValues = inputData.map(seq => findNextValue(seq));


console.log(`Part 1: ${allNextValues.reduce(sum)}`);

const findPrevValue = (seq) => {
  const structure = breakDownSequence(seq).toReversed();
  structure.forEach((element, i) => {
    if(i === structure.length - 1) return;
    structure[i+1] = [structure[i+1].at(0) - element.at(0) , ...structure[i+1]];
  })
  return structure.at(-1).at(0);
}

const allPrevValues = inputData.map(seq => findPrevValue(seq));

console.log(`Part 2: ${allPrevValues.reduce(sum)}`);

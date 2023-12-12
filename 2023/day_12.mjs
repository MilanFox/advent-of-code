import fs from 'fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').split('\n').filter(Boolean).map(line => line.split(' '));
inputData.forEach(line => line[1] = line[1].split(',').map(n => parseInt(n, 10)));

const areAllGroupsValid = ( sequence, condition ) =>
  sequence.split(/\./g).filter(Boolean).every((group, index) => group.length === condition[index]);

const isNumberOfGroupsCorrect = ( sequence, condition ) =>
  sequence.split(/\./g).filter(Boolean).length === condition.length;

const findAllSolutions = ([record, condition]) => {
  const matches = [];
  const continueSequence = (sequence = "", nextChar = "") => {
    if (nextChar) sequence += nextChar;
    for (let i = sequence.length; i < record.length; i++) {
      const nextChar = record[i];
      if (nextChar === "?") {
        if (areAllGroupsValid(sequence, condition)) continueSequence(sequence, ".");
        continueSequence(sequence, "#");
        return;
      }
      sequence += nextChar;
    }
    if (areAllGroupsValid(sequence, condition) && isNumberOfGroupsCorrect(sequence, condition)) matches.push(sequence);
  }
  continueSequence()
  return matches.length;
}

const possibleSolutions = inputData.map(findAllSolutions);
console.log(`Part 1: ${possibleSolutions.reduce((acc, cur) => acc + cur, 0)}`);

const unfoldedData = inputData.map(([record, condition]) =>
  [Array.from({ length: 5 }, () => record).join("?"), Array.from({ length: 5 }, () => [...condition]).flat()]
);

/* ToDo: Find solution for part 2 which doesn't run until infinity... */
const possibleSolutionsForUnfoldedData = unfoldedData.map(findAllSolutions);
console.log(`Part 2: ${possibleSolutionsForUnfoldedData.reduce((acc, cur) => acc + cur, 0)}`);

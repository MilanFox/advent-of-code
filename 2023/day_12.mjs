import fs from 'fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').split('\n').filter(Boolean).map(line => line.split(' '));
inputData.forEach(line => line[1] = line[1].split(',').map(n => parseInt(n, 10)));

const areAllGroupsValid = ( sequence, condition ) => {
  const groups = sequence.split(/\./g).filter(Boolean);
  return groups.every((group, index) => group.length === condition[index]);
}

const isNumberOfGroupsCorrect = ( sequence, condition ) => {
  const groups = sequence.split(/\./g).filter(Boolean);
  return groups.length === condition.length;
}

const possibleSolutions = inputData.map(([record, condition]) => {
  const matches = [];

  /* Note to future Milan: This is the first recursive function you have ever built fully yourself. Nice!*/
  const continueSequence = (sequence = "", nextChar = "") => {
    if (nextChar) sequence += nextChar;

    for (let i = sequence.length; i < record.length; i++) {
      const nextChar = record[i];

      if (nextChar === "?") {
        if (areAllGroupsValid(sequence + ".", condition)) continueSequence(sequence, ".");
        continueSequence(sequence, "#");
        return;
      }

      sequence += nextChar;
    }

    if (areAllGroupsValid(sequence, condition) && isNumberOfGroupsCorrect(sequence, condition)) matches.push(sequence);
  }

  continueSequence()
  return matches.length;
})

console.log(`Part 1: ${possibleSolutions.reduce((acc, cur) => acc + cur, 0)}`);

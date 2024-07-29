import fs from 'fs';

const intCode = fs.readFileSync('input.txt', 'utf-8').trim().split(',').map(n => parseInt(n));

const restoreGravityAssist = (noun, verb) => {
  const program = [...intCode];
  let pointer = 0;
  program[1] = noun;
  program[2] = verb;

  while (true) {
    const [instruction, a, b, target] = program.slice(pointer, pointer + 4);
    if (instruction === 99) return program[0];
    if (instruction === 1) program[target] = program[a] + program[b];
    if (instruction === 2) program[target] = program[a] * program[b];

    pointer += 4;
  }
};

console.log(`Part 1: ${restoreGravityAssist(12, 2)}`);

const findNounAndVerb = () => {
  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      if (restoreGravityAssist(noun, verb) === 19690720) return 100 * noun + verb;
    }
  }
};

console.log(`Part 2: ${findNounAndVerb()}`);

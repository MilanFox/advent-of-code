import fs from 'fs';
import { IntCodeComputer } from './utils/useIntCodeInterpreter.mjs';

const memory = fs.readFileSync('testInput.txt', 'utf-8').trim().split(',').map(n => parseInt(n));

const amplifiers = Array.from({ length: 5 }, () => new IntCodeComputer(memory));

console.log(amplifiers);

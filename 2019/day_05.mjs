import fs from 'fs';
import { IntCodeComputer } from './utils/useIntCodeComputer.mjs';

const memory = fs.readFileSync('input.txt', 'utf-8').trim().split(',').map(n => parseInt(n));

const computer = new IntCodeComputer(memory);
await computer.run();

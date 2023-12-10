import fs from 'fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').split('\n').filter(Boolean).map(line => line.split(''));

const oppositeDirection = {north: 'south', south: 'north', west: 'east', east: 'west'};

const moveInstructions = {
  'north': {offsetX: 0, offsetY: -1},
  'east': {offsetX: 1, offsetY: 0},
  'south': {offsetX: 0, offsetY: 1},
  'west': {offsetX: -1, offsetY: 0}
};

const pipes = {
  'S': {connectsTo: ['north', 'west', 'east', 'south']},
  '|': {connectsTo: ['north', 'south']},
  '-': {connectsTo: ['west', 'east']},
  'L': {connectsTo: ['north', 'east']},
  'J': {connectsTo: ['north', 'west']},
  '7': {connectsTo: ['west', 'south']},
  'F': {connectsTo: ['east', 'south']}
};

const y = inputData.findIndex(line => line.includes('S'));
const x = inputData[y].findIndex(char => char === 'S');
const nodes = [{char: 'S', x, y}];
let lastVisited = undefined;

while (true) {
  const {char, x, y} = nodes.at(-1);
  if (char === 'S' && nodes.length > 1) break;

  for (let i = 0; i < pipes[char].connectsTo.length; i++) {
    const direction = pipes[char].connectsTo[i];
    const { offsetX, offsetY } = moveInstructions[direction];
    const nextChar = inputData[y + offsetY][x + offsetX];

    if (direction === lastVisited) continue;
    if (!Object.keys(pipes).includes(nextChar)) continue;
    if (!pipes[nextChar].connectsTo.includes(oppositeDirection[direction])) continue;

    nodes.push({ char: nextChar, x: x + offsetX, y: y + offsetY })
    lastVisited = oppositeDirection[direction];

    break;
  }
}

nodes.pop() /* Delete duplicate "S" from Pathfinding. */
console.log(`Part 1: ${nodes.length / 2}`);

/* Visualize the loop, until I find out what to do with part 2... */
const visualizationData = Array.from({ length: 140 }, () => Array(140).fill(" "));
const speakingCharacters = {'S': '★', '|': '│', '-': "─", 'L': "╰", 'J': "╯", '7': "╮", 'F': "╭"};
nodes.forEach(({ char, y, x }) => visualizationData[y][x] = speakingCharacters[char]);
const generateVisualisation = (data) => data.map(line => line.join('')).join('\n');
fs.writeFileSync("visualization.txt", generateVisualisation(visualizationData), { flag: "w+" });

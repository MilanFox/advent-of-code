import fs from 'fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').split('\n').filter(Boolean).map(line => line.split(''));

const directions = {
  'north': { opposite: "south", offsetX: 0, offsetY: -1},
  'east': { opposite: "west", offsetX: 1, offsetY: 0},
  'south': { opposite: "north", offsetX: 0, offsetY: 1},
  'west': { opposite: "east", offsetX: -1, offsetY: 0}
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
    const searchDirection = pipes[char].connectsTo[i];
    const { offsetX, offsetY } = directions[searchDirection];
    const nextChar = inputData[y + offsetY][x + offsetX];

    if (searchDirection === lastVisited) continue;
    if (!Object.keys(pipes).includes(nextChar)) continue;
    if (!pipes[nextChar].connectsTo.includes(directions[searchDirection].opposite)) continue;

    nodes.push({ char: nextChar, x: x + offsetX, y: y + offsetY })
    lastVisited = directions[searchDirection].opposite;

    break;
  }
}

nodes.pop() /* Delete duplicate "S" from Pathfinding. */
console.log(`Part 1: ${nodes.length / 2}`);

/* Visualize the loop, until I find out what to do with part 2... best seen in browser */
const visualizationData = Array.from({ length: 140 }, () => Array(140).fill(" "));
const speakingCharacters = {'S': '★', '|': '│', '-': "─", 'L': "╰", 'J': "╯", '7': "╮", 'F': "╭"};
nodes.forEach(({ char, y, x }) => visualizationData[y][x] = speakingCharacters[char]);
const generateVisualisation = (data) => data.map(line => line.join('')).join('\n');
fs.writeFileSync("visualization.txt", generateVisualisation(visualizationData), { flag: "w+" });

/* Part 2 */
const inflateMatrix = (matrix) => {
  const inflationMap = {
    " ": [[" ", " ", " "], [" ", "╳", " "], [" ", " ", " "]],
    "★": [["╭", "─", "╮"], ["│", "★", "│"], ["╰", "─", "╯"]],
    '│': [[" ", "│", " "], [" ", "│", " "], [" ", "│", " "]],
    "─": [[" ", " ", " "], ["─", "─", "─"], [" ", " ", " "]],
    "╰": [[" ", "│", " "], [" ", "╰", "─"], [" ", " ", " "]],
    "╯": [[" ", "│", " "], ["─", "╯", " "], [" ", " ", " "]],
    "╮": [[" ", " ", " "], ["─", "╮", " "], [" ", "│", " "]],
    "╭": [[" ", " ", " "], [" ", "╭", "─"], [" ", "│", " "]],
  }

  const inflatedMatrix = Array.from({ length: matrix.length * 3 }, () => Array(matrix[0].length * 3).fill("."));
  matrix.forEach((row, indexY) => {
    row.forEach((cell, indexX) => {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          inflatedMatrix[(indexY * 3) + i][(indexX * 3) + j] = inflationMap[cell][i][j];
        }
      }
    })
  })

  return inflatedMatrix;
}

/* Memory-safe recursive logic is a variation of the one described here: https://codeguppy.com/blog/flood-fill/index.html */
const fillStack = [];
const floodFill = (matrix, posY, posX) => {
  fillStack.push([posY, posX]);
  while(fillStack.length > 0) {
    const [posY, posX] = fillStack.pop();
    if (!matrix[posY]) continue;
    if (matrix[posY][posX] !== " " && matrix[posY][posX] !== "╳" ) continue;
    matrix[posY][posX] = ` `; // Overwriting " " with "&nbsp;", so we don't run into infinite loops
    for (const direction in directions) {
      fillStack.push([posY + directions[direction].offsetY, posX + directions[direction].offsetX])
    }
  }
}

const inflatedMatrix = inflateMatrix(visualizationData);
floodFill(inflatedMatrix, 0 , 0);

const enclosedWhitespaces = inflatedMatrix.reduce((acc, row) => acc + row.filter(cell => cell === "╳").length, 0);
console.log(`Part 2: ${enclosedWhitespaces}`);

/* Visualizing the second part too, because why not - need to zoom out to see it properly.
   Also best seen in browser, since it displays &nbsp; as space character  */
 fs.writeFileSync("visualization2.txt", generateVisualisation(inflatedMatrix), { flag: "w+" });

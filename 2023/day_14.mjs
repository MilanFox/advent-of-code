import fs from 'fs';

const inputData = fs.readFileSync('testInput.txt', 'utf-8').split('\n').filter(Boolean)

const rotateClockwise = {
  90: (platform) => Array.from({ length: platform[0].length }, (_, i) => platform.map((row) => row[i]).join('').split('').reverse().join('')),
  180: (platform) => platform.map((row) => row.split('').reverse().join('')).reverse(),
  270: (platform) => Array.from({ length: platform[0].length }, (_, i) => platform.map((row) => row[i]).join('')).toReversed(),
}


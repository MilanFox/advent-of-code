import fs from 'fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').split('\n').filter(Boolean)

const rotateClockwise = {
  0: (platform) => platform,
  90: (platform) => Array.from({ length: platform[0].length }, (_, i) => platform.map((row) => row[i]).join('').split('').reverse().join('')),
  180: (platform) => platform.map((row) => row.split('').reverse().join('')).reverse(),
  270: (platform) => Array.from({ length: platform[0].length }, (_, i) => platform.map((row) => row[i]).join('')).toReversed(),
}

const shiftLeft = (line) => line.split('#').map(chunk => chunk.split('').toSorted().toReversed().join('')).join('#');
const directionMap = { north: 270, west: 0, south: 90, east: 180 }
const tilt = (platform, direction) => rotateClockwise[(360 - directionMap[direction]) % 360](rotateClockwise[directionMap[direction]](platform).map(shiftLeft));
const getAllWeights = (row, index) => row.split('').filter(char => char === 'O').length * (row.length - index);
const sum = (acc, cur) => (acc || 0) + cur;

const totalWeightAfterTiltNorth = tilt(inputData, 'north').map(getAllWeights).reduce(sum);
console.log(`Part 1: ${totalWeightAfterTiltNorth}`);

const tiltCyclePlatform = (platform, cycles) => {
  let rotatedPlatform = [...platform];
  for (let cycle = 0; cycle < cycles; cycle++) {
    for (const direction of Object.keys(directionMap)) {
      rotatedPlatform = tilt(rotatedPlatform, direction)
    }
  }
  return rotatedPlatform;
}

// TODO: Check if this Math is true for only my input or for everybodys...
const getSmallestCycle = cycle => cycle < 180 ? cycle : ((cycle - 180) % 9) + 180;
const totalWeightAfterCycling = tiltCyclePlatform(inputData, getSmallestCycle(1_000_000_000)).map(getAllWeights).reduce(sum);
console.log(`Part 2: ${totalWeightAfterCycling}`);

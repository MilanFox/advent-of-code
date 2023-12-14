import fs from 'fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').split('\n').filter(Boolean)

const rotateClockwise = {
  0: (platform) => platform,
  90: (platform) => Array.from({ length: platform[0].length }, (_, i) => platform.map((row) => row[i]).join('').split('').reverse().join('')),
  180: (platform) => platform.map((row) => row.split('').reverse().join('')).reverse(),
  270: (platform) => Array.from({ length: platform[0].length }, (_, i) => platform.map((row) => row[i]).join('')).toReversed(),
}

const shiftLeft = (line) => line.split('#').map(chunk => chunk.split('').toSorted().toReversed().join('')).join('#');
const turnDegree = { north: 270, east: 180, south: 90, west: 0}
const tilt = (platform, direction) => rotateClockwise[(360 - turnDegree[direction]) % 360](rotateClockwise[turnDegree[direction]](platform).map(shiftLeft));
const getAllWeights = (row, index) => row.split('').filter(char => char === 'O').length * (tiltedNorth.length - index);
const sum = (acc, cur) => (acc || 0) + cur;

const tiltedNorth = tilt(inputData, 'north');
const totalWeightAfterTiltNorth = tiltedNorth.map(getAllWeights).reduce(sum);
console.log(`Part 1: ${totalWeightAfterTiltNorth}`);

const tiltCyclePlatform = (platform, cycles) => {
  const directions = ['north', 'west', 'south', 'east'];
  let rotatedPlatform = [...platform];
  for (let cycle = 0; cycle < cycles; cycle++) {
    for (const direction of directions) {
      rotatedPlatform = tilt(rotatedPlatform, direction)
    }
  }
  return rotatedPlatform;
}

// TODO: Check if this Math is true for only my input or for everybodys...
const getSmallestCycle = cycle => cycle < 180 ? cycle : ((cycle - 180) % 9) + 180;
const totalWeightAfterCycling = tiltCyclePlatform(inputData, getSmallestCycle(1_000_000_000)).map(getAllWeights).reduce(sum);
console.log(`Part 2: ${totalWeightAfterCycling}`);

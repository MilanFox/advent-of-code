import fs from 'fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').replaceAll('\n',  '').split(',')
const sum = (acc, cur) => (acc ||0) + cur;

const getHash = ( string ) => {
  let currentValue = 0;
  for (const char of string) currentValue = ((currentValue + char.charCodeAt(0)) * 17) % 256;
  return currentValue;
}

console.log(`Part 1: ${inputData.map(getHash).reduce(sum)}`);

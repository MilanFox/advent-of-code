import fs from 'fs';

class Polymer {
  constructor(template, instructions) {
    this.recipe = template;
    this.instructionList = instructions;
  }

  executeInstructions() {
    const currentRecipe = this.recipe.split('');
    this.recipe = currentRecipe.reduce((acc, cur, i) => {
      const next = currentRecipe[i + 1];
      const insert = this.instructionList.find(({ left, right }) => left === cur && right === next)?.insert ?? '';
      return acc + cur + insert;
    }, '');
  }

  grow(n) {
    for (let i = 0; i < n; i++) this.executeInstructions();
  }

  get elementQuantity() {
    const currentRecipe = this.recipe.split('');
    const quantities = {};
    for (const key of [...new Set(currentRecipe)]) quantities[key] = currentRecipe.filter(el => el === key).length;
    return quantities;
  }
}

class InsertionRule {
  constructor(data) {
    const [pattern, insert] = data.split(' -> ');
    [this.left, this.right] = pattern.split('');
    this.insert = insert;
  }
}

const [template, instruction] = fs.readFileSync('testInput.txt', 'utf-8').trim().split('\n\n');
const polymer = new Polymer(template, instruction.split('\n').map(data => new InsertionRule(data)));

polymer.grow(10);
let quantityDistribution = Object.entries(polymer.elementQuantity).map(([_, quantity]) => quantity).sort((a, b) => a - b);
console.log(`Part 1: ${quantityDistribution.at(-1) - quantityDistribution.at(0)}`);

polymer.grow(30);
quantityDistribution = Object.entries(polymer.elementQuantity).map(([_, quantity]) => quantity).sort((a, b) => a - b);
console.log(`Part 2: ${quantityDistribution.at(-1) - quantityDistribution.at(0)}`);

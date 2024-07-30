import * as readline from 'node:readline';

const ui = readline.createInterface({ input: process.stdin, output: process.stdout });

function askQuestion(query) {
  return new Promise(resolve => ui.question(query, resolve));
}

export class IntCodeComputer {
  constructor(memory) {
    this.#memory = [...memory];
    this.#pointer = 0;
  }

  #memory;
  #pointer;

  /**
   * UTILS
   */

  #movePointer(index) {
    this.#pointer += index;
  }

  #getValue(value, mode) {
    if (mode === 1) return value;
    if (mode === 0) return this.#memory[value];
    throw new Error('Illegal Parameter Mode');
  }

  get #currentInstruction() {
    return this.#memory[this.#pointer] % 100;
  }

  #getCurrentParamModes(n) {
    return this.#memory[this.#pointer].toString().slice(0, -2).padStart(n, '0').split('').reverse().map(n => parseInt(n));
  }

  #getParams(n) {
    const paramModes = this.#getCurrentParamModes(n);
    return this.#memory.slice(this.#pointer + 1, this.#pointer + 1 + n).map((val, i) => this.#getValue(val, paramModes[i]));
  }

  #getOffsetValue(n) {
    return this.#memory[this.#pointer + n];
  }

  /**
   * FUNCTIONS
   */

  #callFunction = [null, this.#add.bind(this), this.#multiply.bind(this), this.#input.bind(this), this.#output.bind(this)];

  #add() {
    const numberOfParams = 2;
    const [addend1, addend2] = this.#getParams(numberOfParams);
    const targetAddress = this.#getOffsetValue(numberOfParams + 1);
    this.#memory[targetAddress] = addend1 + addend2;
    this.#movePointer(numberOfParams + 2);
  }

  #multiply() {
    const numberOfParams = 2;
    const [multiplicant, multiplier] = this.#getParams(numberOfParams);
    const targetAddress = this.#getOffsetValue(numberOfParams + 1);
    this.#memory[targetAddress] = multiplicant * multiplier;
    this.#movePointer(numberOfParams + 2);
  }

  async #input() {
    const targetAddress = this.#getOffsetValue(1);
    const userInput = await askQuestion('Please Input Number: ');
    const value = parseInt(userInput);
    if (Number.isNaN(value)) throw new Error('Only Numbers can be #input');
    this.#memory[targetAddress] = value;
    this.#movePointer(2);
  }

  #output() {
    const targetAddress = this.#getOffsetValue(1);
    console.log(this.#memory[targetAddress]);
    this.#movePointer(2);
  }

  /**
   * PUBLIC
   */

  get memory() {
    return this.#memory;
  }

  async run() {
    while (true) {
      const opCode = this.#currentInstruction;
      if (opCode === 99) break;
      await this.#callFunction[opCode]();
    }

    ui.close();
  }
}

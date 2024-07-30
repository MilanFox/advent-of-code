import * as readline from 'node:readline';

const ui = readline.createInterface({ input: process.stdin, output: process.stdout });

function askQuestion(query) {
  return new Promise(resolve => ui.question(query, resolve));
}

export class IntCodeComputer {
  constructor(memory, { input } = {}) {
    this.#memory = [...memory];
    this.#pointer = 0;
    this.#inputQueue = [];
    this.#outputQueue = [];

    if (input !== undefined) this.#inputQueue = [...input];
  }

  #memory;
  #pointer;
  #inputQueue;
  #outputQueue;

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

  #callFunction = [
    null,
    this.#add.bind(this),
    this.#multiply.bind(this),
    this.#input.bind(this),
    this.#output.bind(this),
    this.#jumpIfTrue.bind(this),
    this.#jumpIfFalse.bind(this),
    this.#lessThan.bind(this),
    this.#equals.bind(this),
  ];

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

    let value;
    if (this.#inputQueue.length) {
      value = this.#inputQueue.shift();
    } else {
      const userInput = await askQuestion('Please Input Number: ');
      value = parseInt(userInput);
    }

    this.#memory[targetAddress] = value;
    this.#movePointer(2);
  }

  #output() {
    const [outputValue] = this.#getParams(1);
    this.#outputQueue.push(outputValue);
    this.#movePointer(2);
  }

  #jumpIfTrue() {
    const [checkValue, jumpTarget] = this.#getParams(2);
    if (checkValue !== 0) this.#pointer = jumpTarget; else this.#movePointer(3);
  }

  #jumpIfFalse() {
    const [checkValue, jumpTarget] = this.#getParams(2);
    if (checkValue === 0) this.#pointer = jumpTarget; else this.#movePointer(3);
  }

  #lessThan() {
    const [param1, param2] = this.#getParams(2);
    const targetAddress = this.#getOffsetValue(3);
    if (param1 < param2) this.#memory[targetAddress] = 1; else this.#memory[targetAddress] = 0;
    this.#movePointer(4);
  }

  #equals() {
    const [param1, param2] = this.#getParams(2);
    const targetAddress = this.#getOffsetValue(3);
    if (param1 === param2) this.#memory[targetAddress] = 1; else this.#memory[targetAddress] = 0;
    this.#movePointer(4);
  }

  /**
   * PUBLIC
   */

  get memory() {
    return this.#memory;
  }

  get outputQueue() {
    return this.#outputQueue;
  }

  get lastOutput() {
    return this.#outputQueue.at(-1);
  }

  queueInput(n) {
    this.#inputQueue.push(n);
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

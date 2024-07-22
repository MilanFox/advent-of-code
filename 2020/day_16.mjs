import fs from 'fs';

class Ticket {
  constructor(data) {
    this.fields = data.split(',').map(n => parseInt(n));
  }

  getInvalidFields(notes) {
    return this.fields.filter(num => !notes.allRules.some(([lower, upper]) => num >= lower && num <= upper));
  }
}

class Notes {
  constructor(data) {
    data.split('\n').forEach(row => {
      const segments = row.split(' ');
      const fieldName = segments[0].slice(0, -1);
      this.fields[fieldName] = [segments[1], segments[3]].map(rule => rule.split('-').map(n => parseInt(n)));
    });
  }

  fields = {};

  get allRules() {
    return Object.values(this.fields).flat();
  }
}

const [notesData, myTicketData, otherTicketsData] = fs.readFileSync('input.txt', 'utf-8').trim().split('\n\n').map(data => data);

const myTicket = new Ticket(myTicketData.split('\n')[1]);
const nearbyTickets = otherTicketsData.split('\n').slice(1).map(data => new Ticket(data));
const notes = new Notes(notesData);

const invalidValues = nearbyTickets.map(ticket => ticket.getInvalidFields(notes)).flat();
const ticketScanningErrorRate = invalidValues.reduce((acc, cur) => acc + cur, 0);

console.log(`Part 1: ${ticketScanningErrorRate}`);

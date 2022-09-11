// We represent each table as JsonTable
// For instance:
// ---------
// | A | B |
// ---------
// | 1 | 2 |
// | 3 | 4 |
// ---------
// is represented as json: [{"A": 1, "B": 2}, {"A": 3, "B": 4}]
// Do the heavy data works in databases! This table should be very lightweight.
export class JsonTable {
  constructor(data) {
    this.data = data;
  }

  // for the example data, the schema is  ["A", "B"]
  schema() {
    return Object.entries(this.data[0]).map(([key, _]) => key);
  }
}

// Helper function to extract values
// Given {"A": 1, "B": 2}, return [1, 2]
export function getValue(row) {
  return Object.entries(row).map(([_, value]) => value);
}

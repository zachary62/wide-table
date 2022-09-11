import * as abc from './abc.js';

// note that this class has the risk of sql injection attack
export class singleTableModel extends abc.Model {
  constructor(database) {
    super();
    this.database = database;
    this.sample = 100;
  }

  setSample(sample) {
    this.sample = sample;
  }

  async createTable(name, location) {
    await this.database.execute_query(
      `create or replace table ${name} as select * from "${location}"`
    );
  }

  async getTable(name) {
    let data = await this.database.execute_query(
      `select * from ${name} limit ${this.sample}`
    );
    return data;
  }
}

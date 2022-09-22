import * as abc from './abc.js';

// note that this class has the risk of sql injection attack
export class multiTableModel extends abc.Model {
  constructor(database) {
    super();
    this.database = database;
    this.sample = 100;
    this.tables = []
  }

  setSample(sample) {
    this.sample = sample;
  }

  async createTable(name, location) {
    let data = await this.database.execute_query(
      `create or replace table ${name} as select * from read_csv_auto('${location}', AUTO_DETECT = True)`
    );
    this.tables.push(name);
    return data
  }

  async getTableData(name, size=this.sample) {
    return await this.database.execute_query(
      `select * from ${name} limit ${size}`
    );
  }

  async getJoinedTables(t1, a1, t2, a2, joinType = '') {
    return await this.database.execute_query(
      `select * from "${t1}" t1 join "${t2}" t2 on t1."${a1}" = t2."${a2}" limit 100;`
    )
  }

  async getAttributes(table) {
    let data = await this.database.execute_query(
      `select column_name from information_schema.columns where table_name = '${table}'`
    );
    return data;

  }
  getTableList() {
    return this.tables;
  }

  async getTableSchema(name) {
    return await this.database.execute_query(
      `select * from information_schema.tables where table_name = '${name}'`
    )
  }
}

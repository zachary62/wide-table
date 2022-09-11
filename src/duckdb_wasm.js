// details of how to set up duckdb_wasm can be found at https://github.com/duckdb/duckdb-wasm/tree/master/packages/duckdb-wasm

import * as abc from './abc.js';
import * as table from './jsonTable.js';
import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_wasm_next from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';

export class DuckdbWasm extends abc.Database {
  constructor() {
    super();
    // this is a wrapper such that constructor can be async
    // see https://stackoverflow.com/questions/43431550/async-await-class-constructor
    return (async () => {
      // below codes are from https://github.com/duckdb-wasm-examples/duckdbwasm-vitebrowser
      const MANUAL_BUNDLES = {
        mvp: {
          mainModule: duckdb_wasm,
          mainWorker: mvp_worker,
        },
        eh: {
          mainModule: duckdb_wasm_next,
          mainWorker: eh_worker,
        },
      };

      // Select a bundle based on browser checks
      const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);

      // Instantiate the asynchronus version of DuckDB-wasm
      const worker = new Worker(bundle.mainWorker);
      const logger = new duckdb.ConsoleLogger();
      this.db = new duckdb.AsyncDuckDB(logger, worker);
      await this.db.instantiate(bundle.mainModule, bundle.pthreadWorker);

      // Connect to db
      this.conn = await this.db.connect();
      return this; // Return the newly-created instance
    })();
  }

  async execute_query(sql) {
    let startTime = performance.now();
    let res = await this.conn.query(sql);
    console.log(`Query: ${sql}`);
    // the time will be inaccurate because of async
    console.log(`Query took ${performance.now() - startTime} milliseconds`);
    // https://github.com/GoogleChromeLabs/jsbi/issues/30
    let data = JSON.parse(
      JSON.stringify(
        res.toArray(),
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
      )
    );
    return new table.JsonTable(data);
  }
}

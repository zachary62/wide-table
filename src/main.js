// // Add some content to the HTML
// document.querySelector('#app').innerHTML = `
//   <h1>Hello Vite!</h1>
//   <h4>Open the DevTools console to see the output</h4>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `;

// d3.select('#app').append('hello');

import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_wasm_next from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';

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
const db = new duckdb.AsyncDuckDB(logger, worker);
await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

// Connect to db
const conn = await db.connect();

let res = await conn.query(
  'select * from "https://raw.githubusercontent.com/zachary62/attribution-playbook/master/data/ad_spend.csv"'
);
console.log('Statement result (Table):', res);

let jsonTable = JSON.parse(
  JSON.stringify(
    res.toArray(),
    (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
  )
);
console.log(
  'Statement result copy (JSON):',
  // Bug fix explained at: https://github.com/GoogleChromeLabs/jsbi/issues/30
  jsonTable
);

function getSchema(jsonTable) {
  return Object.entries(jsonTable).map(([key, _]) => key);
}

function getValue(jsonTable) {
  return Object.entries(jsonTable).map(([_, value]) => value);
}

console.log('Schema:', getSchema(jsonTable));

// add table to the page
var table = d3
  .select('#app')
  .append('table')
  .attr('class', 'table table-hover');
var header = table.append('thead').append('tr');
header
  .selectAll('th')
  .data(getSchema(jsonTable[0]))
  .enter()
  .append('th')
  .text(function (d) {
    return d;
  });
var tablebody = table.append('tbody');
let rows = tablebody.selectAll('tr').data(jsonTable).enter().append('tr');

let cells = rows
  .selectAll('td')
  .data(function (d) {
    return getValue(d);
  })
  .enter()
  .append('td')
  .text(function (d) {
    return d;
  });

import * as dk from './duckdb_wasm.js';
import * as sTModel from './singleTableModel.js';
import * as sTView from './singleTableView.js';

// these codes create, read and display tables
let database = await new dk.DuckdbWasm();
console.log(database);
let model = new sTModel.singleTableModel(database);
model.createTable(
  'auto_call',
  'https://raw.githubusercontent.com/zachary62/wide-table/d1a036762d3a1965d566012ddf53a3b92e8deb5c/data/auto_recalls.csv'
);
let jsTable = await model.getTable('auto_call');
let view = new sTView.singleTableView(d3.select('#tableView'));
view.displayTable(jsTable);

// user can load specified table from location
let tableManagerElement = d3.select('#tableManager');
let form = tableManagerElement.append('form');
let tableNameInput = form
  .append('input')
  .attr('type', 'text')
  .attr('value', 'Table Name');
let tableLocationInput = form
  .append('input')
  .attr('type', 'text')
  .attr('value', 'Table Location');
let AddTable = tableManagerElement.append('button');
AddTable.html('Add Table');
AddTable.on('click', function () {
  changeTable(tableNameInput, tableLocationInput);
});

// TODO: this will create a table and update view if the query is executed successfully
// otherwise, this will print the error message
function changeTable(tableNameInput, tableLocationInput) {
  let tableName = tableNameInput.property('value');
  let tableLocation = tableLocationInput.property('value');
  alert(`Table Name: ${tableName}, Table Location: ${tableLocation}`);
}

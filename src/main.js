import * as dk from './duckdb_wasm.js';
import * as sTModel from './singleTableModel.js';
import * as sTView from './singleTableView.js';
import * as mTModel from './multiTableModel.js';

import * as tMView from './tableManagerView.js';
import * as gView from './joinGraphView.js';
import * as tMController from './tableManagerController.js';



// these codes create, read and display tables
let database = await new dk.DuckdbWasm();

console.log(database);
let singleTableModel = new sTModel.singleTableModel(database);
// model.createTable(
//   'auto_call',
//   'https://raw.githubusercontent.com/zachary62/wide-table/d1a036762d3a1965d566012ddf53a3b92e8deb5c/data/auto_recalls.csv'
// );
// let jsTable = await model.getTable('auto_call');
let singleTableView = new sTView.singleTableView(d3.select('#tableView'));
let graphViewElement = d3.select('#graphView');
let graphView = new gView.joinGraphView(graphViewElement);

// view.displayTable(jsTable);

// user can load specified table from location
let tableManagerElement = d3.select('#tableManager');
let tableManagerView = new tMView.tableManagerView(tableManagerElement);
let multiTableModel = new mTModel.multiTableModel(database);
let tableManagerController = new tMController.tableManagerController(multiTableModel, tableManagerView, singleTableView, graphView);
// tableManagerController.addTable("gold", 'https://raw.githubusercontent.com/zachary62/wide-table-data/main/lol/gold.csv');
// tableManagerController.addTable("bans", 'https://raw.githubusercontent.com/zachary62/wide-table-data/main/lol/bans.csv');
tableManagerController.addTable("kills", 'https://raw.githubusercontent.com/zachary62/wide-table-data/main/lol/kills.csv');
tableManagerController.addTable("monsters", 'https://raw.githubusercontent.com/zachary62/wide-table-data/main/lol/monsters.csv');






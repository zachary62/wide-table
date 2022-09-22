import * as abc from './abc.js';

export class tableManagerController extends abc.Controller {
  constructor(model, tMView, sTView) {
    super(model, tMView, sTView);
    this.sTView = sTView;

    // bind methods
    tMView.bindAddTableButton(addTable);
    tMView.bindShowSchemaAndSample(this.showSchemaAndSamples);
  }

  addTable = (tableName, tableLocation) => {
    let failureCallback = (reason) => {
      tMView.displayError(reason);
    };
    let successCallback = function () {
      errorField.html('success');
      model.getTableData(tableName).then(function (value) {
        sTView.clearAndDisplayTable(value);
      }, failureCallback);
    };
    model
      .createTable(tableName, tableLocation)
      .then(successCallback, failureCallback);
  };

  showSchemaAndSamples = (table1, table2) => {
    let failureCallback = (reason) => {
      tMView.displayError(reason);
    };
    this.getSchemaAndSamples.then((resp) => {
      // sTView.displayTable(resp.)
    }, failureCallback);
  };

  getSchemaAndSamples = async (table1, table2) => {
    schema1 = await model.getTableSchema(table1);
    schema2 = await model.getTableSchema(table2);
    sample1 = await model.getTableData(table1, 10);
    sample2 = await model.getTableData(table2, 10);

    return {
      schema1: schema1,
      schema2: schema2,
      sample1: sample1,
      sample2: sample2,
    };
  };
}

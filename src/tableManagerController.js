import * as abc from './abc.js';


let failureCallback = (reason) => {
  this.tMView.displayError(reason);
};

export class tableManagerController extends abc.Controller {
  constructor(model, tMView, sTView) {
    super(model, tMView, sTView);
    this.sTView = sTView;
    this.tMView = tMView;

    // bind methods
    this.tMView.bindAddTableButton(this.addTable);
    this.tMView.bindShowSchemaAndSample(this.showSchemaAndSamples);
    this.tMView.bindJoin(this.joinTables);
    this.tMView.bindSelectAttrs1(this.getAttrs);
    this.tMView.bindSelectAttrs2(this.getAttrs);

  }
  

  addTable = (tableName, tableLocation) => {

    let successCallback = () => {
      // errorField.html('success');
      this.model.getTableData(tableName).then( (value) => {
        this.sTView.clearAndDisplayTable(value);
        this.tMView.displayTableSelections(this.model.getTableList())
      }, failureCallback);
    };
    this.model
      .createTable(tableName, tableLocation)
      .then(successCallback, failureCallback);
  };

  showSchemaAndSamples = (table1, table2) => {

    this.getSchemaAndSamples(table1, table2).then((resp) => {
      this.sTView.clear();
      this.sTView.displayTable(resp.schema1)
      this.sTView.displayTable(resp.sample1)

      this.sTView.displayTable(resp.schema2)
      this.sTView.displayTable(resp.sample2)
    }, failureCallback);
  };

  getAttrs = (table) => {
    this.model.getAttributes(table).then( (data) => {
      console.log(data.data)
      let columns = data.data.map(e=> e.column_name);
      this.tMView.displayAttributes(columns);
    })
  }
  joinTables = (t1, a1, t2, a2) => {

    this.model.joinTables(t1, a1, t2, a2).then( (data) => {
        this.sTView.clearAndDisplayTable(data);
    }, failureCallback);
  }

  getSchemaAndSamples = async (table1, table2) => {
    let schema1 = await this.model.getTableSchema(table1);
    let schema2 = await this.model.getTableSchema(table2);
    let sample1 = await this.model.getTableData(table1, 10);
    let sample2 = await this.model.getTableData(table2, 10);

    return {
      "schema1": schema1,
      "schema2": schema2,
      "sample1": sample1,
      "sample2": sample2,
    };
  };
}

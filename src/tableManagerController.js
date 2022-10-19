import * as abc from './abc.js';



export class JoinCondition {
  table1;
  table2;
  attr1;
  attr2;
  cardinality;
  constructor(table1, table2, attr1, attr2) {
    this.table1 = table1;
    this.table2= table2;
    this.attr1 = attr1;
    this.attr2 = attr2;
  }
}

export class tableManagerController extends abc.Controller {

  constructor(model, tMView, sTView, gView) {
    super(model, tMView, sTView);
    this.sTView = sTView;
    this.tMView = tMView;
    this.gView = gView;

    // bind methods
    this.tMView.bindAddTableButton(this.addTable);
    this.tMView.bindShowSchemaAndSample(this.showSchemaAndSample);
    // this.tMView.bindJoin(this.joinTables);
    this.tMView.bindSelectAttrs(this.getAttrs);
    this.tMView.bindJoinCondition(this.updateJoinCondition);
    this.tMView.bindAddJoinCondition(this.addJoinCondition);
    this.tMView.bindGenerateGraph(this.generateGraph);
    this.tMView.bindDeleteJoin(this.deleteJoin);
    this.joinConditions = [];

    this.joinGraph = {
      "nodes": [],
      "links": []
    }
  }

  addJoinCondition = (data) => {

    this.joinConditions.push(new JoinCondition(data.table1, data.table2, data.attr1, data.attr2));

    // TODO: add cardinality data
    let tableAttributeMapping = new Map();
    this.model.getTableList().forEach((table) => {
      this.model.getAttributes(table).then((value) => {
        let columns = value.data.map(e=> e.column_name);
        tableAttributeMapping.set(table, columns);
      }, this.failureCallback).then(() => {
        this.tMView.bindJoinCondition(this.updateJoinCondition);
        this.tMView.bindSelectAttrs(this.getAttrs);
        this.tMView.bindDeleteJoin(this.deleteJoin);
        this.tMView.displayJoinConditions(this.joinConditions, tableAttributeMapping);
      })
    });

  }

  updateJoinCondition = (idx, data) => {
    this.joinConditions[idx] = new JoinCondition(data.table1, data.table2, data.attr1, data.attr2);
  }

  deleteJoin = (idx, rowId) => {
    this.joinConditions.splice(idx, 1);
    this.tMView.removeElement(rowId);
    
    
    // refresh
    let tableAttributeMapping = new Map();
    this.model.getTableList().forEach((table) => {
      this.model.getAttributes(table).then((value) => {
        let columns = value.data.map(e=> e.column_name);
        tableAttributeMapping.set(table, columns);
      }, this.failureCallback).then(() => {

        //regenerate join input
        this.tMView.generateJoinInputs(this.joinConditions.length);
        this.tMView.bindJoinCondition(this.updateJoinCondition);
        this.tMView.bindSelectAttrs(this.getAttrs);
        this.tMView.bindDeleteJoin(this.deleteJoin);
        this.tMView.displayJoinConditions(this.joinConditions, tableAttributeMapping);
      })
    });
  }

  generateGraph = (data) => {
    //validate
    this.joinGraph.nodes = [];
    this.joinGraph.links = [];
    for (let i=0;i<data.length;i++) { 
      if (this.isValidJoinCondition(data[i])) {
          if (this.joinGraph.nodes.find(e => e.id === data[i].table1) === undefined) {
            this.joinGraph.nodes.push({"id": data[i].table1, "name": data[i].table1});
          }
          if (this.joinGraph.nodes.find(e => e.id === data[i].table2) ===undefined) {
            this.joinGraph.nodes.push({"id": data[i].table2, "name": data[i].table2});
          }
          if (this.joinGraph.links.find(e => e.source === data[i].table1 && e.target === data[i].table2) ===undefined) {
            this.joinGraph.links.push({"source": data[i].table1, "target": data[i].table2});
          }
      }
    }
    this.gView.clearGraph();
    this.gView.displayGraph(this.joinGraph);
  }

  isValidJoinCondition = (joinCondition) => {
    if (joinCondition.table1 === "" || joinCondition.table2 === "" || joinCondition.attr1 === "" || joinCondition.attr2 === "") {
      console.log('found invalid');
      return false;
    }
    return true;
  }

  failureCallback = (reason) => {
    this.tMView.displayError(reason);
  };

  addTable = (tableName, tableLocation) => {

    let successCallback = () => {
      // errorField.html('success');
      this.model.getTableData(tableName).then( (value) => {
        // this.sTView.clearAndDisplayTable(value);
        this.tMView.displayTableSelections(this.model.getTableList())
      }, this.failureCallback);
    };
    this.model
      .createTable(tableName, tableLocation)
      .then(successCallback, this.failureCallback);
  };

  showSchemaAndSample = (table) => {

    this.getSchemaAndSample(table).then((resp) => {
      this.sTView.clear();
      // this.sTView.displayTable(resp.schema1)
      this.sTView.displayTable(resp.sample1)
    }, this.failureCallback);
  };

  showSchemaAndSamples = (table1, table2) => {

    this.getSchemaAndSamples(table1, table2).then((resp) => {
      this.sTView.clear();
      // this.sTView.displayTable(resp.schema1)
      // this.sTView.displayTable(resp.sample1)

      // this.sTView.displayTable(resp.schema2)
      // this.sTView.displayTable(resp.sample2)
    }, this.failureCallback);
  };

  getAttrs = (idx, id, table, currentAttr) => {
    this.tMView.dispatchChangeEventToJoinCondition(idx);
    this.model.getAttributes(table).then((data) => {
      let columns = data.data.map(e=> e.column_name);
      this.tMView.displayAttributes(id, columns, currentAttr);
    })
  }


  joinTables = (t1, a1, t2, a2) => {

    this.model.getJoinedTables(t1, a1, t2, a2).then( (data) => {
        // this.sTView.clearAndDisplayTable(data);
    }, this.failureCallback);
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

  getSchemaAndSample = async (table) => {
    let schema1 = await this.model.getTableSchema(table);
    let sample1 = await this.model.getTableData(table, 10);

    return {
      "schema1": schema1,
      "sample1": sample1,
    };
  };
}

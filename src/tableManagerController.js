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
    this.tMView.bindShowSchemaAndSample(this.showSchemaAndSamples);
    this.tMView.bindJoin(this.joinTables);
    // this.tMView.bindSelectAttrs(this.getAttrs);
    this.tMView.bindAddJoinCondition(this.addJoinCondition);

    this.joinConditions = []
    this.joinGraph = {
      "nodes": [ 
        {"id": 1, "name": "A"},
        {"id": 2,"name": "B"}
      ],
      "links": [ {
        "source": 1,
        "target": 2
      }]
    }
      this.gView.displayGraph(this.joinGraph);

  }

  addJoinCondition = (data) => {
    console.log(data)
    // this.tMView.generateJoinInput(this.joinConditions.length+1);

    //validate
    for (let i=0;i<data.length;i++) {
      this.joinConditions.push(new JoinCondition(data[i].table1, data[i].table2, data[i].attr1, data[i].attr2));
      if (this.isValidJoinCondition(data[i])) {
          joinGraph.nodes.push({"id": table1, "name": table1});
          joinGraph.nodes.push({"id": table2, "name": table2});
          joinGraph.links.push({"source": table1, "target": table2});
          joinGraph.links.push({"source": table2, "target": table1});
      }
    }
    this.gView.displayGraph(this.joinGraph);
    // add to state in this class
    // join with sample of 10
    // calculate cardinality
    // add cardinality data
    // update view for displaying join result
    // update view with latest view of join conditions
    let tableAttributeMapping = new Map();
    this.model.getTableList().forEach((table) => {
      this.model.getAttributes(table).then((value) => {
        let columns = value.data.map(e=> e.column_name);
        tableAttributeMapping.set(table, columns);
      }, this.failureCallback).then(() => {
        this.tMView.displayJoinConditions(this.joinConditions, tableAttributeMapping);
      })
    });
    
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

  showSchemaAndSamples = (table1, table2) => {

    this.getSchemaAndSamples(table1, table2).then((resp) => {
      this.sTView.clear();
      // this.sTView.displayTable(resp.schema1)
      // this.sTView.displayTable(resp.sample1)

      // this.sTView.displayTable(resp.schema2)
      // this.sTView.displayTable(resp.sample2)
    }, this.failureCallback);
  };

  getAttrs = (id, table) => {
    this.model.getAttributes(table).then((data) => {
      console.log(data.data)
      let columns = data.data.map(e=> e.column_name);
      this.tMView.displayAttributes(id, columns);
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
}

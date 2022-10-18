import * as abc from './abc.js';

export class tableManagerView extends abc.View {
  constructor(element) {
    super();
    this.tableManagerElement = element;
    let form = this.tableManagerElement.append('form');
    this.tableNameInput = form
      .append('input')
      .attr('type', 'text')
      .attr('id', 'tableName')
      .attr('value', 'TableName');
    this.tableLocationInput = form
      .append('input')
      .attr('type', 'text')
      .attr('id', 'tableLocation')
      .attr(
        'value',
        'https://raw.githubusercontent.com/zachary62/wide-table/d1a036762d3a1965d566012ddf53a3b92e8deb5c/data/auto_recalls.csv'
      );
    this.addTable = this.tableManagerElement.append('button');
    this.addTable.html('Add Table');
    this.tableManagerElement.append('br');

    this.tableManagerElement
      .append('label')
      .html('List of Tables & Their Attributes');
    this.tableManagerElement.append('br');
    this.tableListBox = this.tableManagerElement
      .append('select')
      .attr('Name', 'List of tables')
      .attr('Multiple', 'true')
      .attr('Size', '5');
 

    this.errorField = this.tableManagerElement
      .append('label')
      .attr('style', 'color:red;')
      .attr('id', 'errorField');
    this.tableManagerElement.append('br');

    // Show sample button
    this.showSample = this.tableManagerElement.append('button');
    this.showSample.html('Show sample and schema');
    this.tableManagerElement.append('br');

    // Add join button
    this.addJoin = this.tableManagerElement.append('button');
    this.addJoin.html('Add Join Template');
    this.tableManagerElement.append('br');

    this.joinContainer = this.tableManagerElement
      .append('div')
      .attr('id', 'join_container');

    this.joinContainer.append();

    this.tableManagerElement.append('br');

    this.generateGraph = this.tableManagerElement.append('button');
    this.generateGraph.html('Generate Join Graph');
    this.tableManagerElement.append('br');
  }

  // ALL BINDS

  bindAddTableButton(handler) {
    this.addTable.on('click', () => {
      let tableName = d3.select('#tableName').property('value');
      let tableLocation = d3.select('#tableLocation').property('value');
      handler(tableName, tableLocation);
    });
  }

  bindShowSchemaAndSample(handler) {
    this.showSample.on('click', () => {
      let table = this.tableListBox.property('value');
      handler(table);
    });
  }

  bindAddJoinCondition(handler) {
    this.addJoin.on('click', () => {
      this.generateJoinInput(this.joinContainer.selectAll('div').size());
      let joinConditions = []
      this.joinContainer.selectAll('div').each(function(row, i) {
        let table1 = d3.select(this).select('#dropdown_t1_' + i).property('value');
        let table2 = d3.select(this).select('#dropdown_t2_' + i).property('value');
        let attr1 = d3.select(this).select('#attrs_t1_' + i).property('value');
        let attr2 = d3.select(this).select('#attrs_t2_' + i).property('value');
        
        joinConditions.push({'table1':table1, 'table2': table2, 'attr1': attr1, 'attr2': attr2});
      })
      handler(joinConditions.at(-1));
    })
  }

  bindGenerateGraph(handler) {
    this.generateGraph.on('click', () => {
      let joinConditions = []
      this.joinContainer.selectAll('div').each(function(row, i) {
        let table1 = d3.select(this).select('#dropdown_t1_' + i).property('value');
        let table2 = d3.select(this).select('#dropdown_t2_' + i).property('value');
        let attr1 = d3.select(this).select('#attrs_t1_' + i).property('value');
        let attr2 = d3.select(this).select('#attrs_t2_' + i).property('value');
        
        joinConditions.push({'table1':table1, 'table2': table2, 'attr1': attr1, 'attr2': attr2});
      })
      handler(joinConditions);
    })
  }

  bindDeleteJoin(deleteJoinHandler) {
    let n = this.joinContainer.selectAll('div').size()
    for (let i=0;i<n;i++) {
      d3.select('#delete_join_' + i).on('click', () => {
        deleteJoinHandler(i, ('#join_row_' + i.toString()));
      });
    }
  }


  bindSelectAttrs(getAttrsHandler) {
    let n = this.joinContainer.selectAll('div').size()
    for (let i=0;i<n;i++) {

      d3.select('#dropdown_t1_' + i).on('change.attr', () => {
        let table1 = d3.select('#dropdown_t1_' + i).property('value');
        let attr1 = d3.select('#attrs_t1_' + i).property('value');
        getAttrsHandler(i, '#attrs_t1_' + i.toString(), table1, attr1);
      });
      d3.select('#dropdown_t2_' + i).on('change.attr', () => {
        let table2 = d3.select('#dropdown_t2_' + i).property('value');
        let attr2 = d3.select('#attrs_t2_' + i).property('value');
        getAttrsHandler(i, '#attrs_t2_' + i.toString(), table2, attr2);
      });
    }
  }

  bindJoinCondition(joinConditionHanlder) {
    let n = this.joinContainer.selectAll('div').size()
    for (let i=0;i<n;i++) {
      // add or update condition in the model
      d3.select('#join_row_' + i).on('change', () => {
        let table1 = d3.select('#dropdown_t1_' + i).property('value');
        let table2 = d3.select('#dropdown_t2_' + i).property('value');
        let attr1 = d3.select('#attrs_t1_' + i).property('value');
        let attr2 = d3.select('#attrs_t2_' + i).property('value');
        joinConditionHanlder(i, {"table1" : table1, "table2": table2, "attr1" : attr1, "attr2": attr2});
      });
    }
  }

  dispatchChangeEventToJoinCondition(idx) {
    d3.select('#join_row_' + idx).dispatch('change');
  }

  //TODO: possible optimization?
  bindJoinConditionChange(handler) {
    let n = this.joinContainer.selectAll('div').size()
    
    for (let i=0;i<n;i++) {
      d3.select('#dropdown_t1_' + i).on('change', () => {
        handler(this.generateJoinConditionArray);
      })
      d3.select('#dropdown_t2_' + i).on('change', () => {
        handler(this.generateJoinConditionArray);
      })
      d3.select('#attrs_t1_' + i).on('change', () => {
        handler(this.generateJoinConditionArray);
      })
      d3.select('#attrs_t2_' + i).on('change', () => {
        handler(this.generateJoinConditionArray);
      })
    }
  }


  // ALL DISPLAY METHODS

  displayError(errMsg) {
    this.errorField.html(`Operation failed with reason: ${errMsg}`);
  }

  displaySuccess() {
    this.errorField.html('success');
  }


  displayTableSelections(tables) {
    this.tableListBox.html(null);
    this.tableListBox.attr('Size', tables.length);


    // TODO: do incremental update instead
    this.joinContainer.selectAll('div').each( function(d, i) {
      let tableDropDown1 = d3.select(this).select('#dropdown_t1_' + i)
      let tableDropDown2 = d3.select(this).select('#dropdown_t2_' + i)
      tableDropDown1.html(null);
      tableDropDown2.html(null);
      tables.forEach((table) => {
        tableDropDown1.append('option').text(table).property('value', table);
        tableDropDown2.append('option').text(table).property('value', table);
      });
    });

    tables.forEach((table) => {
      this.tableListBox.append('option').text(table).property('value', table);
    });
  }

  displayJoinConditions(joinConditions, tableAttrMapping) {
    
    this.joinContainer.selectAll('div').each(function(d, i) {
      this.resetDropDown = function(elem) {
        elem.html(null);
        elem.append('option').text('').property('value','');
      };
      
      let tableDropDown1 = d3.select(this).select('#dropdown_t1_' + i)
      let tableDropDown2 = d3.select(this).select('#dropdown_t2_' + i) 
      let attrDropDown1 = d3.select(this).select('#attrs_t1_' + i)
      let attrDropDown2 = d3.select(this).select('#attrs_t2_' + i)
      
      this.resetDropDown(tableDropDown1);
      this.resetDropDown(tableDropDown2);
      tableAttrMapping.forEach((attrs, table) => {
        tableDropDown1.append('option').text(table).property('value', table);
        tableDropDown2.append('option').text(table).property('value', table);
      })

      let selectedTable1 = tableDropDown1.property('value');
      let selectedTable2 = tableDropDown2.property('value');
      if (joinConditions[i]) {
        selectedTable1 = joinConditions[i].table1;
        selectedTable2 = joinConditions[i].table2;
      }
      tableDropDown1.property('value', selectedTable1);
      tableDropDown2.property('value', selectedTable2);

      this.resetDropDown(attrDropDown1);
      this.resetDropDown(attrDropDown2);

      (tableAttrMapping.get(selectedTable1) || []).forEach((attr) => {
        attrDropDown1.append('option').text(attr).property('value', attr);
      })
      let selectedAttr1 = null;
      if (joinConditions[i]) selectedAttr1 = joinConditions[i].attr1;
      attrDropDown1.property('value', selectedAttr1);

      (tableAttrMapping.get(selectedTable2) || []).forEach((attr) => {
        attrDropDown2.append('option').text(attr).property('value', attr);
      })
      let selectedAttr2 = null;
      if (joinConditions[i]) selectedAttr2 = joinConditions[i].attr2;
      attrDropDown2.property('value', selectedAttr2);
    })

    this.tableListBox.html(null)
    tableAttrMapping.forEach((attrs, table) => {
      this.tableListBox.append('option').text(table).property('value', table);
    });
  }

  displayAttributes(id, attributeSet, currentAttr) {
    let selector = d3.select(id);
    selector.html(null);
    attributeSet.forEach((attr) => {
      selector
        .append('option')
        .text(attr)
        .property('value', attr);
    });
    if (currentAttr) {
      selector.property('value', currentAttr);
    } else {
      selector.property('value', '');
    }
  }

  // UTILS

  generateJoinInputs(n) {
    this.joinContainer.html(null);
    for (let i=0;i<n;i++) {
      this.generateJoinInput(i);
    }
  }

  generateJoinInput(i) {
    let div = this.joinContainer.append('div').attr('id', 'join_row_' + i);
      div.append('label').html('SELECT * FROM ');
      div.append('label').html('&nbsp;');

      div.append('select').attr('id', 'dropdown_t1_' + i)
      .on('selectionchange', (d) => {
        let table1 = d3.select('#dropdown_t1_' + i).property('value');
        console.log(d)
      });
      div.append('label').html('&nbsp;');

      div.append('label').html(' JOIN ');
      div.append('label').html('&nbsp;');

      div.append('select').attr('id', 'dropdown_t2_' + i);
      div.append('label').html('&nbsp;');

      div.append('label').html(' ON ');
      div.append('label').html('&nbsp;');

      div.append('select').attr('id', 'attrs_t1_' + i);
      div.append('label').html('&nbsp;');

      div.append('label').html(' == ');
      div.append('label').html('&nbsp;');
      div.append('select').attr('id', 'attrs_t2_' + i);
      div.append('label').html('&nbsp;');
      div.append('button').attr('id', 'delete_join_' + i).html('X');
      div.append('br');
  }

  

  removeElement(id) {
    d3.select(id).remove();
  }

  generateJoinConditionArray() {
    let joinConditions = []
    this.joinContainer.selectAll('div').each(function(row, i) {
      let table1 = d3.select(this).select('#dropdown_t1_' + i).property('value');
      let table2 = d3.select(this).select('#dropdown_t2_' + i).property('value');
      let attr1 = d3.select(this).select('#attrs_t1_' + i).property('value');
      let attr2 = d3.select(this).select('#attrs_t2_' + i).property('value');
      
      joinConditions.push({'table1':table1, 'table2': table2, 'attr1': attr1, 'attr2': attr2});
    });
    return joinConditions;
  }
}

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
    // this.tableManagerElement.append('label').html('Table 1: ');
    // this.dropdown1 = this.tableManagerElement
    //   .append('select')
    //   .attr('id', 'dropwdown1');
    // this.tableManagerElement.append('label').html(', attributes: ');
    // this.attrs1 = this.tableManagerElement
    //   .append('select')
    //   .attr('id', 'attrs1');
    // this.tableManagerElement.append('br');

    // this.tableManagerElement.append('label').html('Table 2: ');
    // this.dropdown2 = this.tableManagerElement
    //   .append('select')
    //   .attr('id', 'dropwdown2');
    // this.tableManagerElement.append('label').html(', attributes: ');
    // this.attrs2 = this.tableManagerElement
    //   .append('select')
    //   .attr('id', 'attrs2');
    // this.tableManagerElement.append('br');

    // Show sample button
    this.showSample = this.tableManagerElement.append('button');
    this.showSample.html('Show sample and schema');
    this.tableManagerElement.append('br');

    // Add join button
    this.addJoin = this.tableManagerElement.append('button');
    this.addJoin.html('Add Join');
    this.tableManagerElement.append('br');

    this.joinContainer = this.tableManagerElement
      .append('div')
      .attr('id', 'join_container');
    for (let i = 0; i < 1; i++) {
      this.generateJoinInput(i);
    }

    this.joinContainer.append();

    this.tableManagerElement.append('label').html('Join Query : ');

    // this.joinQueryInput = this.tableManagerElement
    //   .append('input')
    //   .attr('type', 'text')
    //   .attr('id', 'joinQueryInput')
    //   .attr('value', '');
    this.tableManagerElement.append('br');
    this.join = this.tableManagerElement.append('button');
    this.join.html('Join');
    this.tableManagerElement.append('br');
  }

  displayError(errMsg) {
    this.errorField.html(`Operation failed with reason: ${errMsg}`);
  }

  displaySuccess() {
    this.errorField.html('success');
  }


  displayTableSelections(tables) {
    this.tableListBox.html(null);
    this.tableListBox.attr('Size', tables.length);
    // this.dropdown1.html(null);
    // this.dropdown2.html(null);


    // TODO: do incremental update instead
    this.joinContainer.selectAll('div').each( function(d, i) {
      let tableDropDown1 = d3.select(this).select('#dropdown_t1_' + i)
      let tableDropDown2 = d3.select(this).select('#dropdown_t2_' + i)
      tableDropDown1.html(null);
      tableDropDown2.html(null);
      tables.forEach((table) => {
        tableDropDown1.append('option').text(table).property('value', table);
        tableDropDown2.append('option').text(table).property('value', table);

      })
    })

    tables.forEach((table) => {
      this.tableListBox.append('option').text(table).property('value', table);
    });
    // tables.forEach((table) => {
    //   this.dropdown1.append('option').text(table).property('value', table);
    // });

    // tables.forEach((table) => {
    //   this.dropdown2.append('option').text(table).property('value', table);
    // });
  }

  displayJoinConditions(joinConditions, tableAttrMapping) {
    console.log(tableAttrMapping)

    this.joinContainer.selectAll('div').each( function(d, i) {
      let tableDropDown1 = d3.select(this).select('#dropdown_t1_' + i)
      let tableDropDown2 = d3.select(this).select('#dropdown_t2_' + i) 
      tableDropDown1.html(null);
      tableDropDown2.html(null);
      tableAttrMapping.forEach((attrs, table) => {
        tableDropDown1.append('option').text(table).property('value', table);
        tableDropDown2.append('option').text(table).property('value', table);
      })
      tableDropDown1.property('value',joinConditions[i].table1);
      tableDropDown2.property('value', joinConditions[i].table2);


      let attrDropDown1 = d3.select(this).select('#attrs_t1_' + i)
      let attrDropDown2 = d3.select(this).select('#attrs_t2_' + i)
      attrDropDown1.html(null);
      attrDropDown2.html(null);
      tableAttrMapping.get(joinConditions[i].table1) || [].forEach((attr) => {
        attrDropDown1.append('option').text(attr).property('value', attr);
      })
      attrDropDown1.property('value',joinConditions[i].attr1);
      tableAttrMapping.get(joinConditions[i].table2) || [].forEach((attr) => {
        attrDropDown2.append('option').text(attr).property('value', attr);
      })
      attrDropDown2.property('value',joinConditions[i].attr2);
    })
    this.tableListBox.html(null)
    tableAttrMapping.forEach((attrs, table) => {
      console.log(table)
      this.tableListBox.append('option').text(table).property('value', table);
    });
    // tables.forEach((table) => {
    //   this.dropdown1.append('option').text(table).property('value', table);
    // });

    // tables.forEach((table) => {
    //   this.dropdown2.append('option').text(table).property('value', table);
    // });
  }

  displayAttributes(id, attributeSet) {
    let selector = d3.select('#' + id);
    console.log(selector);
    selector.html(null);
    attributeSet.forEach((attr) => {
      selector
        .append('option')
        .text(attr)
        .property('value', attr);
    });
  }

  bindAddTableButton(handler) {
    this.addTable.on('click', () => {
      let tableName = d3.select('#tableName').property('value');
      let tableLocation = d3.select('#tableLocation').property('value');
      handler(tableName, tableLocation);
    });
  }

  bindShowSchemaAndSample(handler) {
    this.showSample.on('click', () => {
      let t1 = this.dropdown1.property('value');
      let t2 = this.dropdown2.property('value');
      handler(t1, t2);
    });
  }

  bindAddJoinCondition(handler) {
    this.addJoin.on('click', () => {
      console.log(this.joinContainer.selectAll('div').size())
      this.generateJoinInput(this.joinContainer.selectAll('div').size());
      let joinConditions = []
      this.joinContainer.selectAll('div').each(function(row, i) {
        console.log(d3.select(this))
        let table1 = d3.select(this).select('#dropdown_t1_' + i).property('value');
        let table2 = d3.select(this).select('#dropdown_t2_' + i).property('value');
        let attr1 = d3.select(this).select('#attrs_t1_' + i).property('value');
        let attr2 = d3.select(this).select('#attrs_t2_' + i).property('value');
        
        joinConditions.push({'table1':table1, 'table2': table2, 'attr1': attr1, 'attr2': attr2});
      })
      handler(joinConditions)
    })
  }

  generateJoinInput(i) {
    let div = this.joinContainer.append('div').attr('id', 'join_row_' + i);
      div.append('label').html('SELECT * FROM ');
      div.append('label').html('&nbsp;');

      div.append('select').attr('id', 'dropdown_t1_' + i);
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
      div.append('button').attr('id', 'delete_join' + i).html('X')
      .on('change', (d) => {
        console.log(d);
      });
      div.append('br');
  }

  //only supporting single key join
  bindJoin(handler) {
    this.join.on('click', () => {
      let a1 = this.attrs1.property('value');
      let a2 = this.attrs2.property('value');
      let t1 = this.dropdown1.property('value');
      let t2 = this.dropdown2.property('value');
      handler(t1, a1, t2, a2);
    });
  }
  // TODO: reduce to one generic handler
  // bindSelectAttrs(handler) {
  //   this.dropdown1.on('change', () => {
  //     let table = this.dropdown1.property('value');
  //     handler(this.attrs1.property('id'), table);
  //   });
  //   this.dropdown2.on('change', () => {
  //     let table = this.dropdown2.property('value');
  //     handler(this.attrs2.property('id'), table);
  //   });
  // }
}

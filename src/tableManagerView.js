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
      .attr('value', 'https://raw.githubusercontent.com/zachary62/wide-table/d1a036762d3a1965d566012ddf53a3b92e8deb5c/data/auto_recalls.csv');
    this.addTable = this.tableManagerElement.append('button');
    this.addTable.html('Add Table');
    this.tableManagerElement.append('br');
    this.errorField = this.tableManagerElement
      .append('label')
      .attr('style', 'color:red;')
      .attr('id', 'errorField');
    this.tableManagerElement.append('br');
    this.tableManagerElement.append('label').html('Table 1: ');
    this.dropdown1 = this.tableManagerElement.append('select').attr('id', 'dropwdown1');
    this.tableManagerElement.append('label').html(', attributes: ');
    this.attrs1 = this.tableManagerElement.append('select').attr('id', 'attrs1');
    this.tableManagerElement.append('br');

    this.tableManagerElement.append('label').html('Table 2: ');
    this.dropdown2 = this.tableManagerElement.append('select').attr('id', 'dropwdown2');
    this.tableManagerElement.append('label').html(', attributes: ');
    this.attrs2 = this.tableManagerElement.append('select').attr('id', 'attrs2');
    this.tableManagerElement.append('br');
    

    this.showSample = this.tableManagerElement.append('button');
    this.showSample.html('Show sample and schema');
    this.tableManagerElement.append('br');

    this.tableManagerElement.append('label').html('Join Query : ');

    this.joinQueryInput = this.tableManagerElement
      .append('input')
      .attr('type', 'text')
      .attr('id', 'joinQueryInput')
      .attr('value', '');
    this.tableManagerElement.append('br');
    this.join = this.tableManagerElement.append('button');
    this.join.html('Join');
    this.tableManagerElement.append('br');

  }

  displayError(errMsg) {
    this.errorField.html(`Operation failed with reason: ${errMsg}`);
  }

  displaySuccess() {
    this.errorField.html("success");
  }

  displayTableSelections(tables) {
    this.dropdown1.html(null);
    this.dropdown2.html(null);
    tables.forEach( (table) => {
      this.dropdown1
      .append("option")
      .text(table)
      .property("value", table);
    })

    tables.forEach( (table) => {
      this.dropdown2
      .append("option")
      .text(table)
      .property("value", table);
    })
  }

  displayAttributes(attributeSet1, attributeSet2) {
    if (attributeSet1 != undefined) {

      this.attrs1.html(null);
      attributeSet1.forEach( (attr) => {
        this.attrs1
        .append("option")
        .text(attr)
        .property("value", attr);
      });
    }

    if (attributeSet2 != undefined) {
      this.attrs2.html(null);
      attributeSet2.forEach( (attr) => {
        this.attrs2
        .append("option")
        .text(attr)
        .property("value", attr);
      });
    }  
  }

  bindAddTableButton(handler) {
    this.addTable.on('click', () => {
      let tableName = d3.select('#tableName').property('value');
      let tableLocation = d3.select('#tableLocation').property('value');
      handler(tableName, tableLocation);
    })
  }

  bindShowSchemaAndSample(handler) {
    this.showSample.on('click', () => {
      let t1 = this.dropdown1.property('value');
      let t2 = this.dropdown2.property('value');
      handler(t1, t2);
    })
  }

  //only supporting single key join
  bindJoin(handler) {
    this.join.on('click', () => {
      let a1 = this.attrs1.property('value');
      let a2 = this.attrs2.property('value');
      let t1 = this.dropdown1.property('value');
      let t2 = this.dropdown2.property('value');
      handler(t1, a1, t2, a2);
    })
  }
  // TODO: reduce to one generic handler
  bindSelectAttrs1(handler) {
    this.dropdown1.on('change', () =>{
        let table = this.dropdown1.property('value');
        handler(table);
    });

  }
  bindSelectAttrs2(handler) {

    this.dropdown2.on('change', () =>{
      let table = this.dropdown2.property('value');
      handler(table);
    });
  }

    
}
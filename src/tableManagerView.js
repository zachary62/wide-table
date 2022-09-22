import * as abc from './abc.js';


export class tableManagerView extends abc.View {
  constructor(element) {
    super();
    this.tableManagerElement = element;
    let form = tableManagerElement.append('form');
    let tableNameInput = form
      .append('input')
      .attr('type', 'text')
      .attr('id', 'tableName')
      .attr('value', 'TableName');
    let tableLocationInput = form
      .append('input')
      .attr('type', 'text')
      .attr('id', 'tableLocation')
      .attr('value', 'TableLocation');
    this.addTable = tableManagerElement.append('button');
    addTable.html('Add Table');
    tableManagerElement.append('br');
    this.errorField = tableManagerElement
      .append('label')
      .attr('style', 'color:red;')
      .attr('id', 'errorField');
    tableManagerElement.append('br');
    tableManagerElement.append('label').attr('value', 'Table 1: ');
    this.dropdown1 = tableManagerElement.append('select').attr('id', 'dropwdown1');
    tableManagerElement.append('br');

    tableManagerElement.append('label').attr('value', 'Table 2: ');
    this.dropdown2 = tableManagerElement.append('select').attr('id', 'dropwdown2');
    tableManagerElement.append('br');
    tableManagerElement.append('label').attr('value', 'Join Query : ');

    this.joinQueryInput = this.tableManagerElement
      .append('input')
      .attr('type', 'text')
      .attr('value', 'where...');
    tableManagerElement.append('br');

    this.showSample = tableManagerElement.append('button');
    this.showSample.html('Show sample and schema');

  }

  displayError(errMsg) {
    this.errorField.html(`Operation failed with reason: ${errMsg}`);
  }

  displaySuccess() {
    this.errorField.html("success");
  }

  bindAddTableButton(handler) {
    this.addTable.on('click', () => {
      let tableName = d3.select('#tableName').property('value');
      let tableLocation = d3.select('#tableLocation').property('value');
      handler(tableName, tableLocation);
    })
  }

  showSchemaAndSample(handler) {
    this.showSample.on('click', () => {
      let t1 = d3.select('#dropdown1').property('value');
      let t2 = d3.select('#dropdown2').property('value');
      handler(t1, t2);
    })
  }
}
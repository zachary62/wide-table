import * as abc from './abc.js';
import * as jst from './jsonTable.js';

export class singleTableView extends abc.View {
  // pass in the element where the table will be displayed
  constructor(element) {
    super();
    this.element = element;
  }

  // removes all inner elements and contents of a HTML tag.
  // Note: this does not remove attributes.
  clear() {  
    this.element.html(null)
  }

  // receive data as jsonTable as input, and displays the table
  // below codes use d3. Check out http://bl.ocks.org/yan2014/c9dd6919658991d33b87
  // Note: This function appends new tables, but doesn't clear existing tables.
  displayTable(jsTable) {
    let table = this.element.append('table').attr('class', 'table table-hover');

    let header = table.append('thead').append('tr');
    header
      .selectAll('th')
      .data(jsTable.schema())
      .enter()
      .append('th')
      .text(function (d) {
        return d;
      });

    let tablebody = table.append('tbody');
    let rows = tablebody
      .selectAll('tr')
      .data(jsTable.data)
      .enter()
      .append('tr');

    let cells = rows
      .selectAll('td')
      .data(function (d) {
        return jst.getValue(d);
      })
      .enter()
      .append('td')
      .text(function (d) {
        return d;
      });
  }

  clearAndDisplayTable(jsTable) {
    this.clear();
    this.displayTable(jsTable);
  }
}

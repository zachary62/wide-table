import * as abc from './abc.js';

export class joinGraphView extends abc.View {
  constructor(element) {
    super();
    this.graphViewElement = element; 

    // set the dimensions and margins of the graph
this.margin = {top: 20, right: 30, bottom: 30, left: 40},
  this.width = 400 - this.margin.left - this.margin.right,
  this.height = 400 - this.margin.top - this.margin.bottom;

// append the svg object to the body of the page
this.svg = this.graphViewElement
.append("svg")
  .attr("width", this.width + this.margin.left + this.margin.right)
  .attr("height", this.height + this.margin.top + this.margin.bottom)
.append("g")
  .attr("transform",
        `translate(${this.margin.left}, ${this.margin.top})`);


  }

  displayGraph = (data) => {


      var link = this.svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(data.links)
    .enter().append("line")
    .style("stroke", "#aaa")
      .attr("stroke-width", "8px");

  // Initialize the nodes
  var node = this.svg.append("g")
      .attr("class", "nodes")
    .selectAll("g")
    .data(data.nodes)
    .enter().append("g")

  var circles = node.append("circle")
    .attr("r", 15)
    .attr("fill","#69b3a2");
  var labels = node.append("text")
    .text(function(d) {
      return d.name;
    })
    .attr('x', 6)
    .attr('y', 3);

node.append("title")
    .text(function(d) { return d.id; });


  // Let's list the force we wanna apply on the network
  const simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
      .force("link", d3.forceLink()                               // This force provides links between nodes
            .id(function(d) { return d.id; })                     // This provide  the id of a node
            .links(data.links)                                    // and this the list of links
      )
      .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(this.width / 2, this.height / 2))     // This force attracts nodes to the center of the svg area
      .on("end", ticked);
    simulation.force("link")
      .links(data.links);


  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
  }

  }
}

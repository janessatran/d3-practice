const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'

// set dimensions of canvas
const width = 1000,
      height = 500,
      xMargin = 100,
      yMargin = 100;

// set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// define axis
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .ticks(d3.time.years, 5)
  .outerTickSize(0);

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(10)
  .outerTickSize(0);

// currency formatter
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

 // define tooltip text
var tip = d3.tip()
  .attr('class', 'tooltip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span>" + d.date.getFullYear() + "</span> <br> <span>" + formatter.format(d.gdp); + "</span>";
  });

// add svg element
var svg = d3.select(".chart")
  .attr("width", width + xMargin)
  .attr("height", height + yMargin)
  .append("g")
  .attr("transform", "translate(60, 10)");

svg.call(tip);

const parseDate = d3.time.format("%Y-%m-%d").parse;

function makeChart(data) {
  // scale the range of the data
    x.domain([d3.min(data, (d) => {return d.date; }), 
              d3.max(data, (d) => {return d.date; })]);
    y.domain([0, d3.max(data, (d) => { return d.gdp; })]);
  console.log(d3.max(data, (d) => { return d.gdp; }));
    
    // add axis
    svg.append("g")
       .attr("class", "x-axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);
  
    svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -100)
      .attr("y", 25)
      .style("text-anchor", "end")
      .style("font-weight", "bold")
      .style("font-size", 20+"px")
      .text("Gross Domestic Product");
 
    // add bar chart
    svg.selectAll("bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d) => { return x(d.date); })
      .attr("width", (d) => { return width / data.length;  })
      .attr("y", (d) => { return y(d.gdp); })
      .attr("height", function(d) { return height - y(d.gdp); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
}

// load data
d3.json(url, (error, data) => {
  if (error) {
    console.log(error);
  } else {
    data = data.data;
    data.forEach( (d) => {
      d.date = (new Date(parseDate(d[0])));
      d.gdp = d[1];
    })
    makeChart(data);
  }
});



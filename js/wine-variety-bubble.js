
var width = 550;
var height = 550;


var svg1 = d3.select("#bubble1")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("font-family", "sans-serif")
    .attr("font-size", "10")
    .attr("text-anchor", "middle")
    .attr("class", "bubble");


// var svg = d3.select("#bubble1 svg"),
//     width = +svg.attr("width"),
//     height = +svg.attr("height");

var format = d3.format(",d");

var color = d3.scaleOrdinal(d3.schemeCategory20c);

var pack1 = d3.pack()
    .size([width, height])
    .padding(1.5); 
var path = "/cs498DatavisualizationProject/data/wine_variety_stats_2.csv"
d3.csv(path, function(d) {
  d.value = d.value;
  if (d.value) return d;
}, function(error, classes) {
  if (error) throw error;

  var root = d3.hierarchy({children: classes})
      .sum(function(d) { return d.value; })
      .each(function(d) {
        if (id = d.data.id) {
          d.id = id;
          // d.package = id.slice(0, i);
          // d.class = id.slice(i + 1);
          d.class = id;
        }
      });

  var node = svg1.selectAll(".node")
    .data(pack1(root).leaves())
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

      //newch
  var tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "6px")
      .style("font", "12px sans-serif")
      .text("tooltip");

  node.append("circle")
      .attr("id", function(d) { return d.id; })
      .attr("r", function(d) { return d.r; })
      // .style("fill", function(d) { return color(d.package); })
      .style("fill", function(d) { return color(d.class); })
  
      //newch
      .on("mouseover", function(d) {
              tooltip.text(d.class + " served " + format(d.value) + ' free lunches in 2011. This is a percentage change from ' + parseFloat(d.data.last) +" in 2005 to " + format(d.data.current) +"."); //not working??
              tooltip.style("visibility", "visible");
              tooltip.style("background-color", function(d) { 
                  console.log(d);
                  return parseFloat(d.data.current) - parseFloat(d.data.last) >0 ? "rgba(0, 1, 0, 0.75)" : "rgba(1, 0, 0, 0.75)";
              });
      })
      .on("mousemove", function() {
          return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      })
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});


  node.append("clipPath")
      .attr("id", function(d) { return "clip-" + d.id; })
    .append("use")
      .attr("xlink:href", function(d) { return "#" + d.id; });

   node.append("text")
      .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
    .selectAll("tspan")
    .data(function(d) { return d.data.short.split(/(?=[A-Z][^A-Z])/g); })
    .enter().append("tspan")
      .attr("x", 0)
      .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
      .text(function(d) { return d; });
  node.append("title")
      .text(function(d) { return d.id + "\n" + format(d.value); });
});

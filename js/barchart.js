 var salesData;

    var truncLengh = 30;

    function BarChart()
	 {
		document.getElementById("bubble1").style.display="none";
		document.getElementById("Chart").style.display="block";
        Plot();
     }

    function Plot() {

	d3.csv("/cs498DatavisualizationProject/data/FreeLunches.csv", function(data){
		var chartOptions = [{

        "captions": [{ "1970s": "1970s", "1980s": "1980s", "1990s": "1990s" , "2000s": "2000s","2010s": "2010s"  }],

        "color": [{ "1970s": "#FFA500", "1980s": "#0070C0", "1990s": "#ff0000", "2000s": "#FFA500", "2010s": "#0070C0" }],

        "xaxis": "Decade",

        "xaxisl1": "Year",

        "yaxis": "FreeLunches"

    }]
		console.log(data);
        TransformChartData(data, chartOptions);
		console.log(data);

        BuildBar("chart", data, chartOptions);
		});

    }



    function BuildBar(id, chartData, options, level) {

        //d3.selectAll("#" + id + " .innerCont").remove();

        //$("#" + id).append(chartInnerDiv);

        chart = d3.select("#" + id + " .innerCont");



        var margin = { top: 50, right: 10, bottom: 30, left: 50 },

        width = $(chart[0]).outerWidth() - margin.left - margin.right,

        height = $(chart[0]).outerHeight() - margin.top - margin.bottom

        var xVarName;

        var yVarName = options[0].yaxis;



        if (level == 1) {

            xVarName = options[0].xaxisl1;

        }

        else {

            xVarName = options[0].xaxis;

        }



        var xAry = runningData.map(function (el) {

            return el[xVarName];

        });



        var yAry = runningData.map(function (el) {

            return el[yVarName];

        });



        var capAry = runningData.map(function (el) { return el.caption; });





        var x = d3.scale.ordinal().domain(xAry).rangeRoundBands([0, width], .5);

        var y = d3.scale.linear().domain([0, d3.max(runningData, function (d) { return d[yVarName]; })]).range([height, 0]);

        var rcolor = d3.scale.ordinal().range(runningColors);



        chart = chart

                    .append("svg")  //append svg element inside #chart

                    .attr("width", width + margin.left + margin.right)    //set width

                    .attr("height", height + margin.top + margin.bottom);  //set height



        var bar = chart.selectAll("g")

                        .data(runningData)

                        .enter()

                        .append("g")

                        //.attr("filter", "url(#dropshadow)")

                        .attr("transform", function (d) {

                            return "translate(" + x(d[xVarName]) + ", 0)";

                        });



        var ctrtxt = 0;

        var xAxis = d3.svg.axis()

                    .scale(x)

                    //.orient("bottom").ticks(xAry.length).tickValues(capAry);  //orient bottom because x-axis tick labels will appear on the

                    .orient("bottom").ticks(xAry.length)

                    .tickFormat(function (d) {

                        if (level == 0) {

                            var mapper = options[0].captions[0]

                            return mapper[d]

                        }

                        else {

                            var r = runningData[ctrtxt].caption;

                            ctrtxt += 1;

                            return r;

                        }

                    });



        var yAxis = d3.svg.axis()

                        .scale(y)

                        .orient("left").ticks(5); //orient left because y-axis tick labels will appear on the left side of the axis.



        bar.append("rect")

            .attr("y", function (d) {

                return y(d.FreeLunches) + margin.top - 15;

            })

            .attr("x", function (d) {

                return (margin.left);

            })

            .on("mouseenter", function (d) {

                d3.select(this)

                    .attr("stroke", "white")

                    .attr("stroke-width", 1)

                    .attr("height", function (d) {

                        return height - y(d[yVarName]) + 5;

                    })

                    .attr("y", function (d) {

                        return y(d.FreeLunches) + margin.top - 20;

                    })

                    .attr("width", x.rangeBand() + 10)

                    .attr("x", function (d) {

                        return (margin.left - 5);

                    })

                    .transition()

                    .duration(200);





            })

            .on("mouseleave", function (d) {

                d3.select(this)

                    .attr("stroke", "none")

                    .attr("height", function (d) {

                        return height - y(d[yVarName]);;

                    })

                    .attr("y", function (d) {

                        return y(d[yVarName]) + margin.top - 15;

                    })

                    .attr("width", x.rangeBand())

                    .attr("x", function (d) {

                        return (margin.left);

                    })

                    .transition()

                    .duration(200);



            })

            .on("click", function (d) {

                if (this._listenToEvents) {

                    // Reset inmediatelly

                    d3.select(this).attr("transform", "translate(0,0)")

                    // Change level on click if no transition has started                

                    path.each(function () {

                        this._listenToEvents = false;

                    });

                }

                d3.selectAll("#" + id + " svg").remove();

                if (level == 1) {

                    TransformChartData(chartData, options, 0, d[xVarName]);

                    BuildBar(id, chartData, options, 0);

                }

                else {

                    var nonSortedChart = chartData.sort(function (a, b) {

                        return parseFloat(b[options[0].yaxis]) - parseFloat(a[options[0].yaxis]);

                    });

                    TransformChartData(nonSortedChart, options, 1, d[xVarName]);

                    BuildBar(id, nonSortedChart, options, 1);

                }



            });





        bar.selectAll("rect").attr("height", function (d) {

            return height - y(d[yVarName]);

        })

            .transition().delay(function (d, i) { return i * 300; })

            .duration(1000)

            .attr("width", x.rangeBand()) //set width base on range on ordinal data

            .transition().delay(function (d, i) { return i * 300; })

            .duration(1000);



        bar.selectAll("rect").style("fill", function (d) {

            return rcolor(d[xVarName]);

        })

        .style("opacity", function (d) {

            return d["op"];

        });



        bar.append("text")

            .attr("x", x.rangeBand() / 2 + margin.left - 10)

            .attr("y", function (d) { return y(d[yVarName]) + margin.top - 25; })

            .attr("dy", ".35em")

            .text(function (d) {

                return d[yVarName];

            });



        bar.append("svg:title")

            .text(function (d) {

                //return xVarName + ":  " + d["title"] + " \x0A" + yVarName + ":  " + d[yVarName];

                return d["title"] + " (" + d[yVarName] + ")";

            });



        chart.append("g")

            .attr("class", "x axis")

            .attr("transform", "translate(" + margin.left + "," + (height + margin.top - 15) + ")")

            .call(xAxis)

        .append("text")

            .attr("x", width)

            .attr("y", -6)

        .style("text-anchor", "end")

        //.text("Year");



        chart.append("g")

            .attr("class", "y axis")

            .attr("transform", "translate(" + margin.left + "," + (margin.top - 15) + ")")

            .call(yAxis)

            .append("text")

            .attr("transform", "rotate(-90)")

            .attr("y", 6)

            .attr("dy", ".71em")

            .style("text-anchor", "end")

        //.text("Sales Data");



        if (level == 1) {

            chart.select(".x.axis")

            .selectAll("text")

            .attr("transform", " translate(-20,10) rotate(-35)");

        }



    }



    function TransformChartData(chartData, opts, level, filter) {

        var result = [];

        var resultColors = [];

        var counter = 0;

        var hasMatch;

        var xVarName;

        var yVarName = opts[0].yaxis;



        if (level == 1) {

            xVarName = opts[0].xaxisl1;



            for (var i in chartData) {

                hasMatch = false;

                for (var index = 0; index < result.length; ++index) {

                    var data = result[index];
				


                    if ((data[xVarName] == chartData[i][xVarName]) && (chartData[i][opts[0].xaxis]) == filter) {

                        result[index][yVarName] = result[index][yVarName] + chartData[i][yVarName];

                        hasMatch = true;

                        break;

                    }



                }

                if ((hasMatch == false) && ((chartData[i][opts[0].xaxis]) == filter)) {

                    if (result.length < 9) {

                        ditem = {}

                        ditem[xVarName] = chartData[i][xVarName];

                        ditem[yVarName] = chartData[i][yVarName];

                        ditem["caption"] = chartData[i][xVarName].substring(0, 10) + '...';

                        ditem["title"] = chartData[i][xVarName];

                        ditem["op"] = 1.0 - parseFloat("0." + (result.length));

                        result.push(ditem);



                        resultColors[counter] = opts[0].color[0][chartData[i][opts[0].xaxis]];



                        counter += 1;

                    }

                }

            }

        }

        else {

            xVarName = opts[0].xaxis;



            for (var i in chartData) {

                hasMatch = false;

                for (var index = 0; index < result.length; ++index) {

                    var data = result[index];



                    if (data[xVarName] == chartData[i][xVarName]) {

                        result[index][yVarName] = parseInt(result[index][yVarName]) + parseInt(chartData[i][yVarName]);

                        hasMatch = true;

                        break;

                    }

                }

                if (hasMatch == false) {

                    ditem = {};

                    ditem[xVarName] = chartData[i][xVarName];

                    ditem[yVarName] = chartData[i][yVarName];

                    ditem["caption"] = opts[0].captions != undefined ? opts[0].captions[0][chartData[i][xVarName]] : "";

                    ditem["title"] = opts[0].captions != undefined ? opts[0].captions[0][chartData[i][xVarName]] : "";

                    ditem["op"] = 1;

                    result.push(ditem);



                    resultColors[counter] = opts[0].color != undefined ? opts[0].color[0][chartData[i][xVarName]] : "";



                    counter += 1;

                }

            }

        }





        runningData = result;

        runningColors = resultColors;

        return;

    }



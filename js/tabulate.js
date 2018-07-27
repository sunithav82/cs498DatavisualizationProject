function tabulate(data, columns, id) {
    //newch remove existing table
    d3.select(id).select('table').remove();

    var table = d3.select(id).append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    // At this point, the rows have data associated.
    // So the data function accesses it.
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(d, i) {
                return {value: row[i]};
            });
        })
        .enter()
        .append("td")
        .text(function(d) { return d.value; });
    return table;
};

//http://bl.ocks.org/yan2014/c9dd6919658991d33b87
//http://bl.ocks.org/jhubley/17aa30fd98eb0cc7072f
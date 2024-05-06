function initializeChart(chartContainerName, width, height, margin) {
    let context = Object()

    let svg = d3.select("#" + chartContainerName)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    context.svg = svg
    return context
}

function initializeSelects(context, selectNames, columnNames) {
    d3.selectAll("Select")
        .selectAll('myOptions')
        .data(columnNames)
        .enter()
        .append('option')
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; }) // corresponding value returned by the button

    context.xSelect = document.getElementById(selectNames[0]);
    context.y1Select = document.getElementById(selectNames[1]);
    context.y2Select = document.getElementById(selectNames[2]);

    context.xSelect.selectedIndex = 0
    context.y1Select.selectedIndex = 3
    context.y2Select.selectedIndex = 1

    context.xSelect.onchange = function () {
        console.log("X Axis changed: " + context.xSelect.value)

        context.x = context.x.domain(column_info[context.xSelect.value]["range"])
        context.xAxis.transition().duration(300).call(d3.axisBottom(context.x))

        updateY1(context)
        updateY2(context)
    }

    context.y1Select.onchange = function () {
        console.log("Y1 Axis changed: " + context.y1Select.value)
        updateY1(context)
    }

    context.y2Select.onchange = function () {
        console.log("Y2 Axis changed: " + context.y2Select.value)
        updateY2(context)
    }
}

function initializeAxis(context) {
    // Add X axis
    context.x = d3.scaleLinear()
        .domain(column_info[context.xSelect.value]["range"])
        .range([0, width]);
    context.xAxis = context.svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(context.x));

    // Add Y1 axis
    context.y1 = d3.scaleLinear()
        .domain(column_info[context.y1Select.value]["range"])
        .range([height, 0]);
    context.y1Axis = context.svg.append("g")
        .call(d3.axisLeft(context.y1))

    context.y1Axis.selectAll("path,line")
        .style("stroke", "steelblue");

    // Add Y2 axis
    context.y2 = d3.scaleLinear()
        .domain(column_info[context.y2Select.value]["range"])
        .range([height, 0]);
    context.y2Axis = context.svg.append("g")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(context.y2));
    context.y2Axis.selectAll("path,line")
        .style("stroke", "forestgreen");

    // Add the Y1 line
    context.y1Path = context.svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)

    // Add the Y2 line
    context.y2Path = context.svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "forestgreen")
        .attr("stroke-width", 1.5)
}

function updateY1(context) {
    // adjust axis
    context.y1 = context.y1.domain(column_info[context.y1Select.value]["range"])
    context.y1Axis.transition().duration(300).call(d3.axisLeft(context.y1))

    // adjust line series
    context.y1Path
        .transition()
        .duration(500)
        .attr("d", d3.line()
            .x(function (d) { return context.x(+d[context.xSelect.value]) })
            .y(function (d) { return context.y1(+d[context.y1Select.value]) })
        )
}

function updateY2(context) {
    // adjust axis
    context.y2 = context.y2.domain(column_info[context.y2Select.value]["range"]);
    context.y2Axis.transition().duration(300).call(d3.axisRight(context.y2));

    // adjust line series
    context.y2Path
        .transition()
        .duration(500)
        .attr("d", d3.line()
            .x(function (d) { return context.x(+d[context.xSelect.value]) })
            .y(function (d) { return context.y2(+d[context.y2Select.value]) })
        );
}

function fillResultListTable(data, tableHeaderName, tableBodName) {
    const tableHeader = document.getElementById(tableHeaderName);

    data.columns.forEach(column => {
        var cell = tableHeader.insertCell();
        cell.innerHTML = column + " / " + column_info[column].unit
    });

    const table = document.getElementById(tableBodName);
    data.forEach(item => {
        var row = table.insertRow();
        data.columns.forEach(column => {
            var cell = row.insertCell();
            cell.innerHTML = item[column]
        })
    });
}
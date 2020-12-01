// Define SVG Dimensions
var svgWidth = 1000;
var svgHeight = 800;

// Chart Margins as Object
var margin = {
    top: 100,
    bottom: 100,
    left: 100,
    right: 100
};

// Define Chart Dimensions
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// SVG Wrapper
var svg = d3.select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append SVG Group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load Data
d3.csv("assets/data/data.csv").then(function (dabblerData) {
    
    // Parse Data from CSV
    dabblerData.forEach(data => {
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
    });

    // Create X-Axis Scale Function
    var xLinearScale = d3.scaleLinear()
        .domain([20, d3.max(dabblerData, d => d.obesity)])
        .range([0, chartWidth]);
    
    // Create Y-Axis Scale Function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(dabblerData, d => d.healthcare)])
        .range([chartHeight, 0]);
    
    // Create Axis Functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to Chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);
    
    // Create Circle Data Points
    var circlesGroup = chartGroup.selectAll("circle")
        .data(dabblerData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.obesity))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "lightblue");
    
    // Add Abbreviations in Circles
    chartGroup.selectAll("null")
        .data(dabblerData)
        .enter()
        .append("text")
        .text(function (x) { return x.abbr })
        .attr("x", d => xLinearScale(d.obesity))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("text-anchor", "middle")
        .attr("dy", 5)
        .attr("font-size", 15)
        .attr("fill", "white")
        .attr("font-weight", "bold");
    
    // Axes Labels
    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 50})`)
        .attr("class", "axisText")
        .text("Obese (%)");
    
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", -50 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lack Healthcare (%)");
    
    // Create "toolTip"
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        // .offset([80, -60])
        .html(function (d) {
            return (abbr + '%');
        });

    // Display Circle Information
    chartGroup.call(toolTip);

    // Hover on Circle
    circlesGroup.on("mouseover", function (dabblerData) {
        toolTip.show(dabblerData);
    })

    // Hover off Circle
    .on("mouseout", function (dabblerData, index) {
        toolTip.hide(dabblerData);        
    });

    
}).catch(function (error) {
    console.log(error);
});
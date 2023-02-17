
let margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

let svg = d3.select("#titanic-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.csv("https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv").then(function (data) {
    let x = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return +d.Age
        })])
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    let histogram = d3.histogram()
        .value(function (d) {
            return +d.Age;
        })
        .domain(x.domain())
        .thresholds(x.ticks(10));

    let bins = histogram(data);

    let y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(bins, function (b) {
            return +b.length
        })]);

    svg.append("g")
        .call(d3.axisLeft(y));

    let fill_color = getComputedStyle(document.documentElement).getPropertyValue('--bar-chart-fill');

    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr("transform", function (d) {
            return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function (d) {
            return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function (d) {
            return height - y(d.length);
        })
        .style("fill", fill_color)
}
)


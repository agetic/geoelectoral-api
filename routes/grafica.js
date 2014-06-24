var express = require('express');
var d3 = require('d3');

var router = express.Router();

/* GET /api/v1/elecciones */
router.get('/barras', function(req, res) {
  var width = 500,
    height = 200;

  var y = d3.scale.linear()
    .range([height, 0]);

  var data = [4, 8, 15, 16, 23, 42];

  var chart = d3.select('body')
    .append('svg:svg')
      .attr('class', 'chart')
      .attr('width', width)
      .attr('height', height);

  y.domain([0, d3.max(data, function(d) { return d; })]);

  var barWidth = width / data.length;

  var bar = chart.selectAll('g')
    .data(data)
  .enter().append('g')
    .attr('transform', function(d, i) { return "translate("+i*barWidth+",0)";});

  bar.append("rect")
    .attr("y", function(d) { return y(d); })
    .attr("height", function(d) { return height - y(d); })
    .attr("width", barWidth - 1);

  bar.append('text')
    .attr("x", barWidth / 2)
    .attr("y", function(d) { return y(d) + 3; })
    .attr("dy", ".75em")
    .attr('fill', 'white')
    .attr('text-anchor', 'middle')
    .text(function(d) { return d; });

  var svgsrc = d3.select('.chart').node().outerHTML;
  res.send(svgsrc);
});

module.exports = router;
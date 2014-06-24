var d3 = require('d3');
var graficaBarras = require('./grafica_barras');

var getGraficaBarras = function(opciones) {

  var grafica = graficaBarras()
    .data(opciones.data)
    .width(opciones.width)
    .height(opciones.height)
    .xAxisLabel(opciones.xAxisLabel)
    .yAxisLabel(opciones.yAxisLabel);


  d3.select('body')
    .append('svg:svg')
      .attr('id', opciones.containerId).call(grafica);

  var selector = '#' + opciones.containerId;
  var svgsrc = d3.select(selector).node().outerHTML;

  d3.select(selector).remove();

  console.log(svgsrc);

  return svgsrc;
};

module.exports = {
  getGraficaBarras: getGraficaBarras
};
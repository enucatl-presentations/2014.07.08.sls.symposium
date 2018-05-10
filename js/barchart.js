(function() {
  if (d3.chart == null) {
    d3.chart = {};
  }

  d3.chart.barchart = function() {
    var bar_width, chart, height, margin, n_bins, width, x_axis, x_scale, x_title, x_value, y_axis, y_scale, y_title, y_value;
    margin = {
      top: 20,
      right: 20,
      bottom: 40,
      left: 70
    };
    width = 900;
    height = 600;
    bar_width = 10;
    x_value = function(d, i) {
      return d;
    };
    y_value = function(d, i) {
      return d;
    };
    x_scale = d3.scale.linear();
    y_scale = d3.scale.linear();
    x_axis = d3.svg.axis().scale(x_scale).orient("bottom");
    y_axis = d3.svg.axis().scale(y_scale).orient("left");
    x_title = void 0;
    y_title = void 0;
    n_bins = 100;
    chart = function(selection) {
      return selection.each(function(data) {
        var bars, g, g_enter, layout, svg;
        x_scale.range([0, width - margin.left - margin.right]);
        y_scale.range([height - margin.top - margin.bottom, 0]);
        svg = d3.select(this).selectAll("svg").data([data]);
        g_enter = svg.enter().append("svg").append("g");
        g_enter.append("g").classed("x axis", true).append("text").classed("label", true).attr("x", width - margin.right - margin.left).attr("y", margin.bottom - 6).style("text-anchor", "end").text(x_title);
        g_enter.append("g").classed("y axis", true).append("text").classed("label", true).attr("y", -margin.left + 6).attr("transform", "rotate(-90)").attr("dy", ".71em").style("text-anchor", "end").text(y_title);
        g_enter.append("g").classed("histogram", true);
        svg.attr("width", width).attr("height", height);
        g = svg.select("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
        layout = data.map(function(d, i) {
          return {
            x: x_value(d, i),
            y: y_value(d, i)
          };
        });
        y_scale.domain(d3.extent(layout, function(d) {
          return d.y;
        }));
        x_scale.domain(d3.extent(layout, function(d) {
          return d.x;
        }));
        bars = g.select("g.histogram").selectAll("rect").data(layout);
        bars.enter().append("rect");
        bars.classed("bar", true).attr("x", function(d) {
          return x_scale(d.x);
        }).attr("width", bar_width).attr("height", function(d) {
          return height - y_scale(d.y) - margin.top - margin.bottom;
        }).transition().attr("y", function(d) {
          return y_scale(d.y);
        });
        bars.exit().transition().remove();
        g.select(".x.axis").attr("transform", "translate(0, " + (y_scale.range()[0]) + ")").call(x_axis);
        return g.select(".y.axis").transition().call(y_axis);
      });
    };
    chart.bar_width = function(value) {
      if (!arguments.length) {
        return bar_width;
      }
      bar_width = value;
      return chart;
    };
    chart.width = function(value) {
      if (!arguments.length) {
        return width;
      }
      width = value;
      return chart;
    };
    chart.height = function(value) {
      if (!arguments.length) {
        return height;
      }
      height = value;
      return chart;
    };
    chart.margin = function(value) {
      if (!arguments.length) {
        return margin;
      }
      margin = value;
      return chart;
    };
    chart.x_value = function(v) {
      if (!arguments.length) {
        return x_value;
      }
      x_value = v;
      return chart;
    };
    chart.y_value = function(v) {
      if (!arguments.length) {
        return y_value;
      }
      y_value = v;
      return chart;
    };
    chart.x_title = function(value) {
      if (!arguments.length) {
        return x_title;
      }
      x_title = value;
      return chart;
    };
    chart.y_title = function(value) {
      if (!arguments.length) {
        return y_title;
      }
      y_title = value;
      return chart;
    };
    chart.x_scale = function(value) {
      if (!arguments.length) {
        return x_scale;
      }
      x_scale = value;
      return chart;
    };
    chart.n_bins = function(value) {
      if (!arguments.length) {
        return n_bins;
      }
      n_bins = value;
      return chart;
    };
    chart.y_scale = function(value) {
      if (!arguments.length) {
        return y_scale;
      }
      y_scale = value;
      return chart;
    };
    return chart;
  };

}).call(this);

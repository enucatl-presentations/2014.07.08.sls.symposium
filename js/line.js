(function() {
  if (d3.chart == null) {
    d3.chart = {};
  }

  d3.chart.line = function() {
    var chart, color_scale, color_value, height, interpolation, legend_square_size, margin, width, x_axis, x_scale, x_title, x_value, y_axis, y_scale, y_title, y_value;
    margin = {
      top: 20,
      right: 20,
      bottom: 40,
      left: 70
    };
    width = 900;
    height = 600;
    interpolation = "linear";
    legend_square_size = 18;
    x_value = function(d, i) {
      return d[0];
    };
    y_value = function(d, i) {
      return d[1];
    };
    color_value = function(d) {
      return d.name;
    };
    x_scale = d3.scale.linear();
    y_scale = d3.scale.linear();
    color_scale = d3.scale.category20();
    x_axis = d3.svg.axis().scale(x_scale).orient("bottom");
    y_axis = d3.svg.axis().scale(y_scale).orient("left");
    x_title = void 0;
    y_title = void 0;
    chart = function(selection) {
      return selection.each(function(data) {
        var color_names, g, g_enter, l_enter, legends, lines, svg;
        color_names = (data.map(color_value)).filter(function(d, i, self) {
          return self.indexOf(d === i);
        });
        color_scale.domain(color_names);
        data = data.map(function(d, i) {
          return {
            color: color_value(d),
            values: d.values.map(function(e, j) {
              return {
                x: x_value.call(d.values, e, j),
                y: y_value.call(d.values, e, j)
              };
            })
          };
        });
        x_scale.range([0, width - margin.left - margin.right]);
        y_scale.range([height - margin.top - margin.bottom, 0]);
        svg = d3.select(this).selectAll("svg").data([data]);
        g_enter = svg.enter().append("svg").append("g");
        g_enter.append("g").classed("x axis", true).append("text").classed("label", true).attr("x", width - margin.right - margin.left).attr("y", margin.bottom - 6).style("text-anchor", "end").text(x_title);
        g_enter.append("g").classed("y axis", true).append("text").classed("label", true).attr("y", -margin.left + 6).attr("transform", "rotate(-90)").attr("dy", ".71em").style("text-anchor", "end").text(y_title);
        g_enter.append("g").classed("paths", true);
        g_enter.append("g").classed("legends", true);
        svg.attr("width", width).attr("height", height);
        g = svg.select("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
        if (legend_square_size != null) {
          legends = g.select("g.legends").selectAll("g.legend").data(color_scale.domain());
          l_enter = legends.enter().append("g").classed("legend", true);
          legends.each(function(d) {
            var rects, texts;
            rects = d3.select(this).selectAll("rect").data([d]);
            rects.enter().append("rect").attr("x", width - margin.right - margin.left - legend_square_size).attr("width", legend_square_size).attr("height", legend_square_size);
            rects.style("fill", color_scale);
            texts = d3.select(this).selectAll("text").data([d]);
            texts.enter().append("text").attr("x", width - margin.right - margin.left - legend_square_size - 2).attr("y", 9).attr("dy", legend_square_size / 2).style("text-anchor", "end");
            return texts.text(function(d) {
              return d;
            });
          });
          legends.attr("transform", function(d, i) {
            return "translate(0, " + ((legend_square_size + 2) * i) + ")";
          });
          legends.exit().remove();
        }
        g.select(".x.axis").attr("transform", "translate(0, " + (y_scale.range()[0]) + ")").call(x_axis);
        g.select(".y.axis").transition().call(y_axis);
        lines = g.select(".paths").selectAll(".path").data(data);
        lines.enter().append("path").classed("path", true);
        lines.transition().duration(500).attr("stroke", function(d) {
          return color_scale(d.color);
        }).attr("d", function(d) {
          return (d3.svg.line().interpolate(interpolation).x(function(d) {
            return x_scale(d.x);
          }).y(function(d) {
            return y_scale(d.y);
          }))(d.values);
        });
        return lines.exit().remove();
      });
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
    chart.x_value = function(value) {
      if (!arguments.length) {
        return x_value;
      }
      x_value = value;
      return chart;
    };
    chart.color_value = function(value) {
      if (!arguments.length) {
        return color_value;
      }
      color_value = value;
      return chart;
    };
    chart.y_value = function(value) {
      if (!arguments.length) {
        return y_value;
      }
      y_value = value;
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
    chart.interpolation = function(value) {
      if (!arguments.length) {
        return interpolation;
      }
      interpolation = value;
      return chart;
    };
    chart.legend_square_size = function(value) {
      if (!arguments.length) {
        return legend_square_size;
      }
      legend_square_size = value;
      return chart;
    };
    chart.x_scale = function(value) {
      if (!arguments.length) {
        return x_scale;
      }
      x_scale = value;
      return chart;
    };
    chart.color_scale = function(value) {
      if (!arguments.length) {
        return color_scale;
      }
      color_scale = value;
      return chart;
    };
    chart.y_scale = function(value) {
      if (!arguments.length) {
        return y_scale;
      }
      y_scale = value;
      return chart;
    };
    chart.x_axis = function(value) {
      if (!arguments.length) {
        return x_axis;
      }
      x_axis = value;
      return chart;
    };
    chart.y_axis = function(value) {
      if (!arguments.length) {
        return y_axis;
      }
      y_axis = value;
      return chart;
    };
    return chart;
  };

}).call(this);

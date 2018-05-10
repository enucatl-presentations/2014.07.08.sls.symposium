(function() {
  if (d3.chart == null) {
    d3.chart = {};
  }

  d3.chart.slider = function() {
    var brush, brushed, brushended, chart, dispatch, half_breaks, handle, height, margin, round_to_nearest_tick, width, x, x_axis, x_title;
    margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    };
    width = 900;
    height = 600;
    x = d3.scale.log().domain([1, 1000]).nice().clamp(true);
    x_axis = d3.svg.axis().scale(x).orient("bottom");
    x_title = void 0;
    brush = d3.svg.brush().extent([0, 0]);
    handle = void 0;
    dispatch = d3.dispatch("slider_brushended");
    brushed = function() {
      var value;
      value = brush.extent()[0];
      if (d3.event.sourceEvent) {
        value = x.invert(d3.mouse(this)[0]);
        brush.extent([value, value]);
      }
      return handle.attr("cx", x(value));
    };
    half_breaks = function(array) {
      var first, last;
      last = array.slice(1);
      first = array.slice(0, -1);
      return last.map(function(d, i) {
        return first[i] + (d - first[i]) / 2;
      });
    };
    round_to_nearest_tick = function(extent) {
      var domain, thresholds, ticks, value;
      ticks = x.ticks(x_axis.ticks()[0]);
      domain = half_breaks(ticks);
      value = extent[0];
      thresholds = d3.scale.threshold().domain(half_breaks(ticks)).range(ticks);
      return [thresholds(value), thresholds(value)];
    };
    brushended = function() {
      var extent;
      if (!d3.event.sourceEvent) {
        return;
      }
      extent = round_to_nearest_tick(brush.extent());
      d3.select(this).call(brush.extent(extent));
      handle.transition().attr("cx", x(extent[1]));
      return dispatch.slider_brushended(extent[1]);
    };
    chart = function(selection) {
      return selection.each(function(data) {
        var axis_height, g_enter, slider, svg;
        x.range([0, width - margin.left - margin.right]);
        brush.x(x).on("brush", brushed).on("brushend", brushended);
        svg = d3.select(this).selectAll("svg").data([1]);
        g_enter = svg.enter().append("svg").append("g");
        g_enter.append("g").classed("x axis", true).append("text").classed("label", true).attr("x", width - margin.right - margin.left).attr("y", -6).style("text-anchor", "end").text(x_title);
        g_enter.append("circle").classed("handle", true).classed("slider", true);
        g_enter.append("g").classed("slider", true);
        svg.select("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
        svg.attr("width", width).attr("height", height);
        slider = svg.select(".slider").call(brush);
        slider.select(".background").attr("height", height - margin.top - margin.bottom);
        slider.selectAll(".extent,.resize").remove();
        axis_height = (height - margin.top - margin.bottom) / 2;
        handle = svg.select(".handle").attr("transform", "translate(0, " + axis_height + ")").attr("r", 5);
        slider.call(brush.event);
        return svg.select(".x.axis").attr("transform", "translate(0, " + axis_height + ")").call(x_axis).select(".domain").classed("slider", true).select(function() {
          return this.parentNode.appendChild(this.cloneNode(true));
        }).classed("halo", true);
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
    chart.x = function(value) {
      if (!arguments.length) {
        return x;
      }
      x = value;
      x_axis.scale(x);
      return chart;
    };
    chart.x_title = function(value) {
      if (!arguments.length) {
        return x_title;
      }
      x_title = value;
      return chart;
    };
    chart.x_axis = function(value) {
      if (!arguments.length) {
        return x_axis;
      }
      x_axis = value;
      return chart;
    };
    chart.brush = function(value) {
      if (!arguments.length) {
        return brush;
      }
      brush = value;
      return chart;
    };
    d3.rebind(chart, dispatch, "on");
    return chart;
  };

}).call(this);

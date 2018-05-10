(function() {
  $(function() {
    return d3.json("data/aggregated.json", function(error, json) {
      var factor, placeholder, scatter, width;
      if (error != null) {
        console.warn(error);
        return;
      }
      placeholder = "#ratio-df";
      width = 0.7 * $(placeholder).width();
      factor = 0.618;
      json = json.map(function(d) {
        return {
          name: d.name.toLowerCase(),
          values: d.values
        };
      });
      scatter = d3.chart.scatter().width(width).height(factor * width).x_value(function(d) {
        return d[1];
      }).y_value(function(d) {
        return d[2];
      }).x_title("dark field").y_title("log dark field / log absorption").legend_square_size(28).margin({
        top: 100,
        right: 30,
        bottom: 50,
        left: 80
      });
      scatter.y_scale().domain([0, 5]);
      scatter.y_axis().ticks(4);
      scatter.x_axis().ticks(4);
      return d3.select(placeholder).data([json]).call(scatter);
    });
  });

}).call(this);

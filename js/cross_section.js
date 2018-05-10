(function() {
  $(function() {
    return d3.json("data/cross.section.carbon.json", function(error, data) {
      var cross_section, placeholder, width;
      if (error != null) {
        console.warn(error);
        return;
      }
      placeholder = "#carbon-cross-section";
      width = 0.6 * $(placeholder).width();
      cross_section = d3.chart.line().color_scale(d3.scale.ordinal().domain(data.map(function(d) {
        return d.name;
      })).range(["#b2df8a", "#33a02c", "#a6cee3", "#1f78b4"])).x_value(function(d, i) {
        return d.energy;
      }).y_value(function(d, i) {
        return d.cross_section;
      }).interpolation("basis").x_title("energy (keV)").y_title("cross section (cm²/g)").legend_square_size(28).height(width * 0.618).width(width).margin({
        top: 20,
        right: 30,
        bottom: 60,
        left: 80
      });
      cross_section.x_scale().domain([10, 100]);
      cross_section.y_scale().domain([0.01, 0.5]);
      cross_section.y_axis().ticks(3);
      cross_section.x_axis().ticks(3);
      return d3.select(placeholder).data([data]).call(cross_section);
    });
  });

}).call(this);

$ ->
    d3.json "data/cross.section.carbon.json", (error, data) ->
        if error?
            console.warn error
            return
        placeholder = "#carbon-cross-section"
        width = 0.6 * $(placeholder).width()
        cross_section = d3.chart.line()
            #.x_scale d3.scale.log()
            #.y_scale d3.scale.log()
            .color_scale(d3.scale.ordinal()
            .domain data.map (d) -> d.name
            .range ["#b2df8a", "#33a02c", "#a6cee3", "#1f78b4"]
            )
            .x_value (d, i) -> d.energy
            .y_value (d, i) -> d.cross_section
            .interpolation "basis"
            .x_title "energy (keV)"
            .y_title "cross section (cm²/g)"
            .legend_square_size 28
            .height width * 0.618
            .width width
            .margin {top: 20, right: 30, bottom: 60, left: 80}
        cross_section
            .x_scale()
            .domain [10, 100]
        cross_section
            .y_scale()
            .domain [0.01, 0.5]
        cross_section
            .y_axis()
            .ticks(3)
        cross_section
            .x_axis()
            .ticks(3)
        d3.select placeholder
            .data [data]
            .call cross_section

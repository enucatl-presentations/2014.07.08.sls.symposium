$ ->
    d3.json "data/S00001_S00100_visibility.json", (error, json) ->
        if error?
            console.warn error
            return
        first_pixel = 300
        last_pixel = 900
        data = [
            {
                name: "visibility"
                values: json[first_pixel..last_pixel]
            }
        ]
        placeholder = "#visibility-pixel"
        width = $(placeholder).width()
        visibility_pixel = d3.chart.line()
            .x_value (d, i) -> i
            .y_value (d, i) -> d
            .x_title "pixel"
            .y_title "visibility"
            .legend_square_size undefined
            .height width * 0.12
            .margin {top: 20, right: 30, bottom: 50, left: 80}
        visibility_pixel
            .x_scale()
            .domain [0, last_pixel - first_pixel]
        visibility_pixel
            .y_scale()
            .domain [0, 0.12]
        visibility_pixel
            .y_axis()
            .ticks(3)
        visibility_pixel
            .x_axis()
            .ticks(3)
        d3.select placeholder
            .data [data]
            .call visibility_pixel

        histogram_placeholder = "#visibility-distribution"
        histogram = d3.chart.histogram()
            .x_title "visibility"
            .height width * 0.35
            .value (d) -> d
            .n_bins 26
            .margin {top: 20, right: 30, bottom: 50, left: 80}
        histogram
            .x_scale()
            .domain [0, 0.13]
        histogram
            .y_axis()
            .ticks(4)
        histogram
            .x_axis()
            .ticks(3)
        histogram
            .y_title "number of pixels / #{histogram.x_scale().domain()[1] / histogram.n_bins()}"
        d3.select histogram_placeholder
            .data [json[first_pixel..last_pixel]]
            .call histogram

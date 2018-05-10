$ ->
    sigma_phi = (a, v, n, r=0.5) ->
    #assumes a fixed log ratio of the dark field and absorption. The
    #default value comes from the low energy experiment of Zhentian
        1 / (v * Math.pow(a, r) * Math.sqrt(n * a))

    v = 0.1
    n = 10000

    data = [
        {
            name: "r = 0.5"
            values: d3.range(0.01, 0.99, 0.01).map (x) ->
                {
                    x: x
                    sigma: sigma_phi(x, v, n, 0.5)
                }
        },
        {
            name: "r = 2.0"
            values: d3.range(0.3, 0.99, 0.01).map (x) ->
                {
                    x: x
                    sigma: sigma_phi(x, v, n, 2)
                }
        }
    ]

    placeholder = "#sigma-absorption"
    width = 0.7 * $(placeholder).width()
    sigma_absorption = d3.chart.line()
        .x_value (d, i) -> d.x
        .y_value (d, i) -> d.sigma
        .interpolation "basis"
        .x_title "absorption"
        .y_title "phase standard deviation"
        .legend_square_size 28
        .height width * 0.618
        .width width
        .margin {top: 20, right: 30, bottom: 60, left: 80}
    sigma_absorption
        .x_scale()
        .domain [0, 1]
    sigma_absorption
        .y_scale()
        .domain [0, 2]
    sigma_absorption
        .y_axis()
        .ticks(3)
    sigma_absorption
        .x_axis()
        .ticks(3)
    d3.select placeholder
        .data [data]
        .call sigma_absorption

$ ->
    talbot_carpet = (placeholder, image, sample) ->
        data = d3.range(12).filter (d) -> not (d % 2)
        width = 0.6 * $(placeholder).width()
        factor = 0.618
        introduction = 8
        height = width * factor
        grating_width = 20
        grating_height = height / 12
        svg = d3.select placeholder
            .selectAll "svg"
            .data [data]
            .enter()
            .append "svg"
            .attr "width", width
            .attr "height", height

        svg
            .append "image"
            .attr "x", introduction * grating_width
            .attr "y", 0
            .attr "width", width - introduction * grating_width
            .attr "height", height
            .attr "xlink:href", image
            .attr "preserveAspectRatio", "none"

        svg
            .append "rect"
            .attr "width", introduction * grating_width + 1
            .attr "height", height
            .style "fill", "#e4e4e4"

        if sample
            svg
                .append "polygon"
                .classed "sample", true
                .attr "points", "#{2.6 * grating_width}, #{height / 12}, #{2.6 * grating_width}, #{2 * height / 3}, #{4.1 * grating_width}, #{2 * height / 3}"
            svg
                .append "rect"
                .classed "sample", true
                .attr "width", 1.5 * grating_width
                .attr "height", height / 3
                .attr "x", 2.6 * grating_width
                .attr "y", 2 / 3 * height

        svg
            .selectAll ".grating-rect"
            .data (d) -> d
            .enter()
            .append "rect"
            .classed "grating-rect", true
            .attr "x", (introduction - 1) * grating_width
            .attr "y", (d) -> d * grating_height
            .attr "width", grating_width
            .attr "height", grating_height

    talbot_carpet "#talbot-carpet", "images/talbot_carpet_mono100_False.png", false
    talbot_carpet "#talbot-carpet-sample", "images/talbot_carpet_mono100_True.png", true

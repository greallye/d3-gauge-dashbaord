var gauge = function(container, configuration) {
    var that = {};
    var config = {
        clipWidth: 0,
        clipHeight: 0,
        ringInset: 0,
        ringWidth: 0,

        pointerWidth: 10,
        pointerTailLength: 10,
        pointerHeadLengthPercent: 1,

        minValue: 0,
        maxValue: 70,

        minAngle: -50,
        maxAngle: 50,

        transitionMs: 4000,

        majorTicks: 7,

    };

    var range = undefined;
    var r = undefined;
    var pointerHeadLength = undefined;
    var value = 0;

    var svg = undefined;
    var arc = undefined;
    var scale = undefined;
    var ticks = undefined;
    var tickData = undefined;
    var pointer = undefined;
    var text = undefined;
    var tooltip = undefined;
    var viewbox = undefined;

    var donut = d3.layout.pie();

    function deg2rad(deg) {
        return deg * Math.PI / 180;
    }

    function newAngle(d) {
        var ratio = scale(d);
        var newAngle = config.minAngle + (ratio * range);
        return newAngle;
    }

    function configure(configuration) {
        var prop = undefined;
        for (prop in configuration) {
            config[prop] = configuration[prop];
        }

        range = config.maxAngle - config.minAngle;
        r = config.size / 2;
        pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

        // a linear scale that maps domain values to a percent from 0..1
        scale = d3.scale.linear()
            .range([0, 1])
            .domain([config.minValue, config.maxValue]);

        ticks = scale.ticks(config.majorTicks);
        tickData = d3.range(config.majorTicks).map(function() {
            return 1 / config.majorTicks;
        });

        arc = d3.svg.arc()
            .innerRadius(r - config.ringWidth - config.ringInset)
            .outerRadius(r - config.ringInset)
            .startAngle(function(d, i) {
                var ratio = d * i;
                return deg2rad(config.minAngle + (ratio * range));
            })
            .endAngle(function(d, i) {
                var ratio = d * (i + 1);
                return deg2rad(config.minAngle + (ratio * range));
            });
    }
    that.configure = configure;

    function centerTranslation() {
        return 'translate(' + r + ',' + r + ')';
    }

    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render(newValue) {
        svg = d3.select(container)
            .append('svg:svg')
            .attr('class', 'gauge')

        var centerTx = centerTranslation();
        var arrayOfColor = ['#BDE791', '#A2DA71', '#83C55E', '#FAAD57', '#F98B36', '#C72326', '#C72326'];
        var arcs = svg.append('g')
            .attr('class', 'arc')
            .attr('transform', centerTx);

        arcs.selectAll('path')
            .data(tickData)
            .enter().append('path')
            .attr('fill', function(d, i) {
                return arrayOfColor[i];
            })
            .attr('d', arc);



        var lineData = [
            [config.pointerWidth / 2, 0],
            [0, -pointerHeadLength],
            [-(config.pointerWidth / 2), 0],
            [0, config.pointerTailLength],
            [config.pointerWidth / 2, 0]
        ];
        var pointerLine = d3.svg.line().interpolate('monotone');

        var pg = svg.append('g').data([lineData])
            .attr('class', 'pointer')
            .attr('transform', centerTx)

        text = pg.append('text').attr("dy", "2em")
            .attr("dx", "0")
            .attr("text-anchor", "middle")
            .style('font-size', '30px')
            .style('font-weight', 'bold')
            .text("Very Good")

        viewbox = svg.attr('viewBox', '0 0 700 500')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('width', "700")
            .attr('height', "500");

        tooltip = pg;
        pointer = pg.append('path')
            .attr('d', pointerLine)
            .attr('transform', 'rotate(' + config.minAngle + ')');
    }
    that.render = render;

    function update(newValue, newConfiguration, textValue, width, height, fontSize) {
        if (newConfiguration !== undefined) {
            configure(newConfiguration);
        }
        var ratio = scale(newValue);
        var newAngle = config.minAngle + (ratio * range);
        pointer.transition()
            .duration(config.transitionMs)
            .ease('elastic')
            .attr('transform', 'rotate(' + newAngle + ')');
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        tooltip.on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .html(newValue);
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", 0);
            });
        text.text(textValue).style('font-size', fontSize);
        viewbox.attr('viewBox', '0 0 ' + width + ' ' + height)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('width', width)
            .attr('height', height);


    }
    that.update = update;

    configure(configuration);

    return that;
};
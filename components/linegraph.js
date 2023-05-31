class Linegraph {
    margin = {
        top: 10, right: 100, bottom: 40, left: 40
    }

    constructor(svg, data, width = 800, height = 400) {
        this.svg = svg;
        this.data = data;
        this.width = width;
        this.height = height;

        this.handlers = {};
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.y1Axis = this.svg.append("g");
        this.y2Axis = this.svg.append("g");
        this.legend = this.svg.append("g");

        this.xScale = d3.scaleTime();
        this.y1Scale = d3.scaleLinear();
        this.y2Scale = d3.scaleLinear();

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    }

    update(xVar, y1Var, y2Var) {
        this.xVar = xVar;
        this.y1Var = y1Var;
        this.y2Var = y2Var;

        this.xScale.domain([new Date("2020-01-01"), new Date("2022-12-31")]).range([0, this.width]);
        this.y1Scale.domain(d3.extent(this.data, d => d[y1Var])).range([this.height, 0]);
        this.y2Scale.domain([0, 100]).range([this.height, 0]);

        d3.selectAll("path").remove()
        this.line1 = this.container.append("path")
            .datum(data.filter(d => d["date"].getDate() % 5 == 0))
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => this.xScale(d[xVar]))
                .y(d => this.y1Scale(d[y1Var]))
                .curve(d3.curveLinear)
                )

        this.line2 = this.container.append("path")
            .datum(data.filter(d => d["date"].getDate() % 5 == 0))
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => this.xScale(d[xVar]))
                .y(d => this.y2Scale(d[y2Var]))
                .curve(d3.curveLinear)
                )
    
        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .call(d3.axisBottom(this.xScale));

        this.y1Axis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .call(d3.axisLeft(this.y1Scale));

        this.y2Axis
            .attr("transform", `translate(${this.margin.left + this.width}, ${this.margin.top})`)
            .call(d3.axisRight(this.y2Scale));
    }

    on(eventType, handler) {
        this.handlers[eventType] = handler;
    }
}
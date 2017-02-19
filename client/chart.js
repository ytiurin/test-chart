import React from "react";
import * as d3 from "d3";

export default class Chart extends React.Component {
  constructor(props) {
    super(props);

    this.labels = []
    this.paths = []
  }

  initChart() {
    const svg = d3.select("svg"),
        margin = {top: 20, right: 60, bottom: 30, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom

    this.width = width

    this.x = d3.scaleTime()
        .rangeRound([0, width]);

    this.y = d3.scaleLinear()
        .rangeRound([height, 0]);

    this.line = d3.line()
        .x( d => this.x( d.time ))
        .y( d => this.y( d.value ))

    this.g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    this.xAxis = this.g.append("g")
    this.xAxis.attr("transform", "translate(0," + height + ")")
      .select(".domain")
        .remove();

    // Y axis
    this.yAxis = this.g.append("g")
    this.yAxisText = this.yAxis
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($)");

    this.chartInited = 1
    this.updateChart()
  }

  produceLabel( i, label ) {
    return this.g.append("text")
      .text( label )
      .attr("fill", "#000")
      .attr("x", this.width )
      .attr("dx", "1em")
      .attr("dy", "0.31em")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10")
  }

  producePath( i ) {
    return this.g.append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
  }

  updateChart() {
    const yExtrems = this.props.graphs.reduce(( r, d ) => r.concat(d.data), [] )

    this.x.domain( d3.extent( this.props.graphs[0].data, d => d.time ))
    this.y.domain( d3.extent( yExtrems, d => d.value ))

    this.xAxis.call( d3.axisBottom( this.x ))
    this.yAxis.call( d3.axisLeft( this.y ))

    const getLastYFromPath = path => {
      const d = path.attr("d") || ""
      return d.substr( d.lastIndexOf(",") + 1)
    }

    this.props.graphs.map(( d, i ) => {
      this.paths[ i ] = this.paths[ i ] || this.producePath( i )
      this.labels[ i ] = this.labels[ i ] || this.produceLabel( i, d.label )

      this.paths[ i ].datum( d.data ).attr( "d", this.line )
      this.labels[ i ].attr( "y", getLastYFromPath( this.paths[ i ] ));
    })

    this.yAxisText.text( this.props.typeLabel )
  }

  componentDidMount() {
    this.initChart()
  }

  render() {
    if ( this.chartInited )
      this.updateChart()

    return <svg width="960" height="500"></svg>
  }
}

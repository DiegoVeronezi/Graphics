import { Component, OnInit } from '@angular/core';
import { GraphData } from 'src/app/models/graph-data.model';
import * as d3 from 'd3';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.css']
})
export class GraphicComponent implements OnInit {

  svg: any;
  groups: any;
  rect: any;

  constructor() { }

  ngOnInit() {
    
    const margin : any = { top: 20, right: 160, bottom: 35, left: 30 };
    const animationDuration : number = 700;
    const animationDelay : number = 30;

    const width : any = 960,
      height : any = 500 - margin.top - margin.bottom;


    this.svg = d3.select(".graph")
      .append("svg")
      .attr("width", width)
      .attr("height", height + 50)
      .attr("font-family", "sans-serif")
      .style("font-size", "12px")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const data : GraphData[] = [
      { month: "Julho", value: 100000, amount: 300 },
      { month: "Agosto", value: 800000, amount: 150 },
      { month: "Setembro", value: 1523500, amount: 450 },
      { month: "Outubro", value: 1200000, amount: 200 },
      { month: "Novembro", value: 1700000, amount: 100 },
      { month: "Dezembro", value: 1400000, amount: 155 },
      { month: "Janeiro", value: 1500000, amount: 360 },
      { month: "Fevereiro", value: 1800000, amount: 400 },
    ];

    // Transpose the data into layers
    const dataset : any = d3.layout.stack()(["month"].map(function () {
      return data.map(function (d) {
        return { x: d.month, y: d.value, amount: d.amount };
      });
    }));

    // Set x, y 
    const x: any = d3.scale.ordinal()
      .domain(dataset[0].map(function (d) { return d.x; }))
      .rangeRoundBands([10, width - 10], 0.02);

    const y: any = d3.scale.linear()
      .domain([0, d3.max(dataset, function (d) { return d3.max(d, function (d) { return d.y0 + d.y; }); })])
      .range([height, 0]);

    // axes
    const yAxis: any = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(8, "s")
      .tickSize(-height, 10, 1);

    const xAxis: any = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-width, 0, 0)
      .tickFormat(function (d) { return d });

    this.svg.append("g")
      .attr("class", "y axis")
      .style("fill", "#272727")
      .attr("transform", "translate(11,0)")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Valores");

    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    this.groups = this.svg.selectAll("g.base")
      .data(dataset)
      .enter().append("g")
      .attr("class", "base")
      .style("fill", "#6fb143");

    this.rect = this.groups.selectAll("rect")
      .data(function (d) { return d; })
      .enter()
      .append("rect")
      .attr("x", function (d) { return x(d.x); })
      .attr("y", height)
      .attr("height", 0)
      .attr("width", x.rangeBand())
      .style("cursor", "pointer")
      .on("mouseover", function (d) {
        ValueTooltip.transition()
          .duration(400)
          .style("opacity", 1);
        ValueTooltip.select("text").text("R$ " + new Intl.NumberFormat('pt-BR').format(d.y));
        AmountTooltip.transition()
          .duration(400)
          .style("opacity", 1);
        AmountTooltip.select("text").text("Qtd: " + d.amount);
        d3.select(this).style("fill", "#639940");
      })
      .on("mouseout", function () {
        ValueTooltip.style("opacity", 0);
        AmountTooltip.style("opacity", 0);
        d3.select(this).style("fill", "#6fb143")
      })
      .on("mousemove", function () {
        const xPosValue: any = d3.mouse(this)[0] - 25;
        const yPosValue: any = d3.mouse(this)[1] - 50;
        const xPosQtd: any = d3.mouse(this)[0] - 25;
        const yPosQtd: any = d3.mouse(this)[1] - 85;
        ValueTooltip.attr("transform", "translate(" + xPosValue + "," + yPosValue + ")");
        AmountTooltip.attr("transform", "translate(" + xPosQtd + "," + yPosQtd + ")");
      });

    // Animation  
    this.rect.transition()
      .attr("height", function (d) {
        return y(d.y0) - y(d.y0 + d.y);
      })
      .attr("y", function (d) {
        return y(d.y0 + d.y);
      })
      .duration(animationDuration)
      .delay(function (d, i) {
        console.log(d);
        return i * animationDelay;
      })
      .ease("elastic");

    // Tooltip
    const ValueTooltip: any = this.svg.append("g")
      .attr("class", "tooltip")
      .style("opacity", 0);

    ValueTooltip.append("rect")
      .attr("width", 140)
      .attr("height", 30)
      .attr("rx", 10)
      .attr("fill", "white")
      .style("opacity", 0.5);

    ValueTooltip.append("text")
      .attr("x", 15)
      .attr("dy", "1.38em")
      .attr("font-size", "15px")
      .style("font-style", "italic");


    const AmountTooltip: any = this.svg.append("g")
      .attr("class", "tooltip")
      .style("opacity", 0);

    AmountTooltip.append("rect")
      .attr("width", 95)
      .attr("height", 30)
      .attr("rx", 10)
      .attr("fill", "white")
      .style("opacity", 0.5);

    AmountTooltip.append("text")
      .attr("x", 15)
      .attr("dy", "1.38em")
      .attr("font-size", "15px")
      .style("font-style", "italic");
      
  }
}

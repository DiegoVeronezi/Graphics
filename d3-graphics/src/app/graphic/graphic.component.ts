import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { callLifecycleHooksChildrenFirst } from '@angular/core/src/view/provider';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.css']
})
export class GraphicComponent implements OnInit {

  radius = 10;

  constructor() { }

  ngOnInit() {
  }

  clicked(event : any) {
    d3.select(event.target).
    append('circle')
    .attr('cx',event.x)
    .attr('cy',event.y)
    .attr('r',() => {
      return this.radius;
    })
    .attr('fill', 'white');
  }
  

}

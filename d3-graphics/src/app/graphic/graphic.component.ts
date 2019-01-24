import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.css']
})
export class GraphicComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    d3.select('p').style('color', 'red');
  }
  
}

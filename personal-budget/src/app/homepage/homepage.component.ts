import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { DataService } from '../data.service';
import * as d3 from 'd3';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  data2: { Framework: any; Stars: any; Released: string; }[];
  constructor(private http: HttpClient, public data1: DataService) { }
  public dataSource =  {
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
          '#8a89a6',
          '#a05d56',
          '#7b6888',
          '#d0743c',
          '#98abc5',
        ]
      }
    ],
    labels: []
  };
  private svg;
  private margin = 50;
  private width = 400;
  private height = 400;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors;

  ngOnInit(): void {
    this.data1.Budget()
    .subscribe((res: any) => {
      for (let i = 0; i < res.length; i++) {
        this.dataSource.datasets[0].data[i] = res[i].budget;
        this.dataSource.labels[i] = res[i].title;
      }
      this.createChart();
      this.textfile();
      this.createSvg();
      this.createColors();
      this.drawChart();
    });

  }
  textfile() {


      this.data2 = [

        {'Framework': this.dataSource.labels[0], 'Stars': this.dataSource.datasets[0].data[0], 'Released': '2014'},
        {'Framework': this.dataSource.labels[1], 'Stars': this.dataSource.datasets[0].data[1], 'Released': '2015'},
        {'Framework': this.dataSource.labels[2], 'Stars': this.dataSource.datasets[0].data[2], 'Released': '2016'},
        {'Framework': this.dataSource.labels[3], 'Stars': this.dataSource.datasets[0].data[3], 'Released': '2012'},
        {'Framework': this.dataSource.labels[4], 'Stars': this.dataSource.datasets[0].data[4], 'Released': '2011'},
        {'Framework': this.dataSource.labels[5], 'Stars': this.dataSource.datasets[0].data[5], 'Released': '2010'},
        {'Framework': this.dataSource.labels[6], 'Stars': this.dataSource.datasets[0].data[6], 'Released': '2019'},
        {'Framework': this.dataSource.labels[7], 'Stars': this.dataSource.datasets[0].data[7], 'Released': '2013'}
      ];


  }
  // tslint:disable-next-line: typedef
  createChart() {
    // const ctx = document.getElementById('myChart').getContext('2d');
    const ctx = document.getElementById('myChart');
    const myPieChart = new Chart(ctx, {
      type: 'pie',
      data: this.dataSource,
    });
  }

  private createSvg(): void {
    this.svg = d3.select('figure#pie')
    .append('svg')
    .attr('width', this.width)
    .attr('height', this.height)
    .append('g')
    .attr(
      'transform',
      'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
    );
  }
  private createColors(): void {
    this.colors = d3.scaleOrdinal()
    .domain(this.data2.map(d => d.Stars))
    .range(['#ff6384',
    '#36a2eb',
    '#fd6b19',
    '#8a89a6',
    '#a05d56',
    '#7b6888',
    '#d0743c',
    '#98abc5']);
  }
  private drawChart(): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d.Stars));
    // Build the pie chart
    this.svg
    .selectAll('pieces')
    .data(pie(this.data2))
    .enter()
    .append('path')
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(this.radius)
    )
    .attr('fill', (d, i) => (this.colors(i)))
    .attr('stroke', '#121926')
    .style('stroke-width', '1px');

    // Add labels
    const labelLocation = d3.arc()
    .innerRadius(100)
    .outerRadius(this.radius);

    this.svg
    .selectAll('pieces')
    .data(pie(this.data2))
    .enter()
    .append('text')
    .text(d => d.data.Framework)
    .attr('transform', d => 'translate(' + labelLocation.centroid(d) + ')')
    .style('text-anchor', 'middle')
    .style('font-size', 15);
  }
}


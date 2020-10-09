import { Component, AfterViewInit, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { DataService } from '../data.service';
import * as d3 from 'd3';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit, OnInit {
  // tslint:disable-next-line: variable-name
  private _current: any;


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

  public result = [];
  public width = 250 ;
  public height = 250 ;
  public radius = Math.min(this.width, this.height) / 2;

  public svg = d3.select('#chart').append('svg').append('g').attr('class', 'slices')
  .attr('class', 'labels').attr('class', 'lines').attr('transform', 'translate( ' + this.width / 2 + ',' + this.height / 2 + ')');

  // svg.append('g').attr('class', 'slices');
  // svg.append('g').attr('class', 'labels');
  // svg.append('g').attr('class', 'lines');

  public pie = d3.pie()
        .sort(null)
        .value((d: any) => {
          return d.value;
        });

  public arc = d3.arc()
        .outerRadius(this.radius * 0.8)
        .innerRadius(this.radius * 0.4);

  public outerArc = d3.arc()
        .innerRadius(this.radius * 0.9)
        .outerRadius(this.radius * 0.9);

  public color = d3.scaleOrdinal()
        .range([
          '#98abc5',
          '#8a89a6',
          '#7b6888',
          '#6b486b',
          '#a05d56',
          '#d0743c',
          '#ff8c00',
          '#36a2eb'
        ]);

  public key = (d) => {
    return d.data.label;
  }

  ngAfterViewInit(): void {
    this.data1.Budget()
    .subscribe((res: any) => {
      console.log(res);
      for (let i = 0; i < res.length; i++) {
        this.dataSource.datasets[0].data[i] = res[i].budget;
        this.dataSource.labels[i] = res[i].title;
        // console.log(this.dataSource[i]);
      }
      this.createChart();
    });
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


  private randomData(): void {
    this.data1.Budget()
    .subscribe((res: any) => {
      for (let i = 0; i < res.length; i++) {
        this.result[i] = res[i].title;
      }
      console.log(this.result);
      return this.result.map(label => {
        // tslint:disable-next-line: object-literal-shorthand
        return { label: this.result , value: Math.random() };
      });
    });
  }
  private change(data): void {

    const slice = this.svg
      .select('.slices')
      .selectAll('path.slice')
      .data(this.pie(data), this.key);

    slice
      .enter()
      .insert('path')
      .style('fill', (d): any => {
        return this.color(d.data.toString());
      })
      .attr('class', 'slice');

    slice
      .transition()
      .duration(1000)
      .attrTween('d', (d) => {
        this._current = this._current || d;
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return (t) => {
          return this.arc(interpolate(t));
        };
      });

    slice.exit().remove();

    /* ------- TEXT LABELS -------*/

    const text = this.svg.select('.labels').selectAll('text').data(this.pie(data), this.key);

    text
      .enter()
      .append('text')
      .attr('dy', '.35em')
      .text((d) => {
        return d.data.label;
      });

    // tslint:disable-next-line: typedef
    function midAngle(d: any) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    text
      .transition()
      .duration(1000)
      .attrTween('transform', (d) => {
        this._current = this._current || d;
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return (t: any) => {
          const d2 = interpolate(t);
          const pos = this.outerArc.centroid(d2);
          pos[0] = this.radius * (midAngle(d2) < Math.PI ? 1 : -1);
          return 'translate(' + pos + ')';
        };
      })
      .styleTween('text-anchor', (d) => {
        this._current = this._current || d;
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return (t: any) => {
          const d2 = interpolate(t);
          return midAngle(d2) < Math.PI ? 'start' : 'end';
        };
      });

    text.exit().remove();

    const polyline = this.svg
      .select('.lines')
      .selectAll('polyline')
      .data(this.pie(data), this.key);

    polyline.enter().append('polyline');

    polyline.transition()
      .duration(1000)
      .attrTween('points', (d): any => {
        this._current = this._current || d;
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return (t) => {
          const d2 = interpolate(t);
          const pos = this.outerArc.centroid(d2);
          pos[0] = this.radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [this.arc.centroid(d2), this.outerArc.centroid(d2), pos];
        };
      });

    polyline.exit().remove();
  }

  ngOnInit(): void {

    setTimeout(() => {
      this.change(this.randomData());
    }, 1000);

    d3.select(window).on('load', () => {
      this.change(this.randomData());
    });
    d3.select('.randomize').on('click', () => {
      this.change(this.randomData());
    });

}
}

import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

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

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.http.get('http://localhost:3000/budget')
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

}

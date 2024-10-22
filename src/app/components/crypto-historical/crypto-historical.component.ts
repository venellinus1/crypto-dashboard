import { Component, Input, OnInit } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import * as echarts from 'echarts';
import { AgGridAngular } from 'ag-grid-angular'; 
import { CommonModule } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css'; 

@Component({
  selector: 'app-crypto-historical',
  templateUrl: './crypto-historical.component.html',
  styleUrls: ['./crypto-historical.component.css'],
  standalone: true,
  imports: [AgGridAngular, CommonModule],
})
export class CryptoHistoricalComponent implements OnInit {
  @Input() coin: string = 'bitcoin';
  historicalData: any[] = [];
  columnDefs = [
    { field: 'date', headerName: 'Date', sortable: true, filter: true, flex: 1 },
    { field: 'price', headerName: 'Price (USD)', sortable: true, filter: true, flex: 2 },
  ];


  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.fetchHistoricalData();
  }

  fetchHistoricalData(): void {
    this.cryptoService.getHistoricalData(this.coin).subscribe((data: any) => {
      this.historicalData = data.prices.map((price: number[]) => ({
        date: new Date(price[0]).toLocaleDateString(),
        price: price[1],
      }));
      this.renderChart();
    });
  }

  renderChart(): void {
    const chartDom = document.getElementById(`chart-${this.coin}`) as HTMLElement;
    const myChart = echarts.init(chartDom);
    const option = {
      
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: this.historicalData.map((item) => item.date),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: this.historicalData.map((item) => item.price),
          type: 'line',
          smooth: true,
        },
      ],
    };
    myChart.setOption(option);
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ILocation } from '../../../interfaces/ilocation';
import { LocationService } from '../../../services/location.service';
import { WeatherService } from '../../../services/weather.service';
import { ChartConfiguration } from 'chart.js';
import { IHistoricalRain } from '../../../interfaces/ihistorical-rain';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-rain',
  imports: [BaseChartDirective],
  templateUrl: './rain.component.html',
  styleUrl: './rain.component.css'
})
export class RainComponent implements OnInit {

  private weatherService: WeatherService = inject(WeatherService);
  private locationService = inject(LocationService)
  public location: ILocation | undefined = this.locationService.getLocation;
  public rainData: IHistoricalRain[] = [];

  public globalChartLegend = true;
  public lineChartPlugins = [];
  public doughnutChartPlugins = [ChartDataLabels];
  public lineChartPrecipitationData?: ChartConfiguration<'line'>['data'];
  public doughnutChartPrecipitationTypeData?: ChartConfiguration<'doughnut'>['data'];

  public maxPrecipitation?: number;
  public maxPrecipitationDate?: Date;
  public amountPrecipitationAllDay?: number;

  ngOnInit(): void {
    this.locationService.locationChange.subscribe((location: ILocation) => {
      this.location = location;
      this.getRain();
    });
    this.getRain();
  }

  private getRain() {
    if (this.location) {
      this.weatherService.getHistoricalRain(this.location?.coordinates.lat, this.location?.coordinates.long).subscribe(rainData => {
        this.rainData = rainData;
        this.maxPrecipitation = Math.max(...this.rainData?.map((weather: IHistoricalRain) => weather.precipitation));
        this.maxPrecipitationDate = this.rainData?.find((weather: IHistoricalRain) => weather.precipitation === this.maxPrecipitation)?.date;
        this.amountPrecipitationAllDay = (this.rainData?.filter((weather: IHistoricalRain) => weather.precipitation_hours === 24)).length;
        this.updateChartData();
      });
    }
  }

  private updateChartData(): void {
    this.lineChartPrecipitationData = {
      labels: this.rainData?.map((weather: IHistoricalRain) => weather.date.toLocaleDateString()),
      datasets: [
        { data: this.rainData?.map((weather: IHistoricalRain) => weather.precipitation), label: 'Precipitação' },
        { data: this.rainData?.map((weather: IHistoricalRain) => weather.precipitation_hours), label: 'Horas de precipitação' }
      ]
    };
    this.doughnutChartPrecipitationTypeData = {
      labels: ['Chuva', 'Neve', 'Nenhuma'],
      datasets: [
        { data: [
          this.rainData?.filter((weather: IHistoricalRain) => weather.rain !== 0).length, 
          this.rainData?.filter((weather: IHistoricalRain) => weather.snowfall !== 0).length,
          this.rainData?.filter((weather: IHistoricalRain) => (weather.snowfall === 0 && weather.rain === 0)).length
        ]}
      ]
    };
  }


  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { position: typeof window !== 'undefined' && window.innerWidth > 600 ?'top':'right' } }
  };
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { position: 'right' },
    datalabels: {
      formatter: (value: number, context: any) => {
        const total = context.chart.data.datasets[0].data.reduce((acc: number, val: number) => acc + val, 0);
        const percentage = ((value / total) * 100).toFixed(2) + '%';
        return percentage === '0.00%' ? '': percentage;
      },
      font: {
        size: typeof window !== 'undefined' && window.innerWidth > 600 ? 14 : 8,
        weight: 'bold',
      }
    }}
  };

}

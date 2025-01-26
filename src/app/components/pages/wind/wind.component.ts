import { Component, inject } from '@angular/core';
import { IHistoricalWind } from '../../../interfaces/ihistorical-wind';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ILocation } from '../../../interfaces/ilocation';
import { LocationService } from '../../../services/location.service';
import { WeatherService } from '../../../services/weather.service';

@Component({
  selector: 'app-wind',
  imports: [BaseChartDirective],
  templateUrl: './wind.component.html',
  styleUrl: './wind.component.css'
})
export class WindComponent {

  private weatherService: WeatherService = inject(WeatherService);
  private locationService = inject(LocationService)
  public location: ILocation | undefined = this.locationService.getLocation;
  public windData: IHistoricalWind[] = [];

  public globalChartLegend = true;
  public globalChartPlugins = [];
  public barChartWindData?: ChartConfiguration<'bar'>['data'];
  public radarChartWindDirectionData?: ChartConfiguration<'radar'>['data'];

  public maxWindSpeed?: number;
  public maxWindSpeedDate?: Date;
  public maxWindGust?: number;
  public maxWindGustDate?: Date;
  private directionsCount = Array(8).fill(0);

  ngOnInit(): void {
    this.locationService.locationChange.subscribe((location: ILocation) => {
      this.location = location;
      this.getWind();
    });
    this.getWind();
  }

  private getWind() {
    if (this.location) {
      this.weatherService.getHistoricalWind(this.location?.coordinates.lat, this.location?.coordinates.long).subscribe(windData => {
        this.windData = windData;
        this.maxWindSpeed = Math.max(...this.windData?.map((weather: IHistoricalWind) => weather.wind_speed));
        this.maxWindSpeedDate = this.windData?.find((weather: IHistoricalWind) => weather.wind_speed === this.maxWindSpeed)?.date;
        this.maxWindGust = Math.max(...this.windData?.map((weather: IHistoricalWind) => weather.wind_gusts));
        this.maxWindGustDate = this.windData?.find((weather: IHistoricalWind) => weather.wind_gusts === this.maxWindGust)?.date;
        this.windData?.forEach((weather: IHistoricalWind) => {
          const direction = weather.wind_direction % 360;
          const index = Math.floor((direction + 22.5) / 45) % 8;
          this.directionsCount[index]++;
        });
        this.updateChartData();
      });
    }
  }

  private updateChartData(): void {
    this.barChartWindData = {
      labels: this.windData?.map((weather: IHistoricalWind) => weather.date.toLocaleDateString()),
      datasets: [
        { data: this.windData?.map((weather: IHistoricalWind) => weather.wind_speed), label: 'Velocidade do vento' },
        { data: this.windData?.map((weather: IHistoricalWind) => weather.wind_gusts), label: 'Rajadas de vento' }
      ]
    };

    this.radarChartWindDirectionData = {
      labels: ['Norte (0°)', 'Nordeste (45°)', 'Leste (90°)', 'Sudeste (135°)', 'Sul (180°)', 'Sudoeste (225°)', 'Oeste (270°)', 'Noroeste (315°)'],
      datasets: [
        { data: this.directionsCount, label: 'Quantidade de dias' }
      ]
    };
  }


  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { position: typeof window !== 'undefined' && window.innerWidth > 600 ? 'top' : 'right' } }
  };

  public radarChartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        ticks: {
          showLabelBackdrop: false
        },
        grid: {
          color: 'rgb(136, 136, 136)',
          circular: true
        },
        angleLines: {
          color: 'rgb(136, 136, 136)',
          lineWidth: 1
        }
      }
    }
  };


}
